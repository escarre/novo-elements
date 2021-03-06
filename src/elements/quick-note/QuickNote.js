import { Component, EventEmitter, ElementRef, ViewContainerRef, ComponentResolver, ViewChild, Optional } from '@angular/core'; //eslint-disable-line
import { NgModel } from '@angular/common';
import 'rxjs/Rx'; //eslint-disable-line

import { OutsideClick } from './../../utils/outside-click/OutsideClick';
import { KeyCodes } from './../../utils/key-codes/KeyCodes';
import { QuickNoteResults } from './extras/quick-note-results/QuickNoteResults';
import { ContentEditableModel } from './../../directives/content-editable-model/ContentEditableModel';

@Component({
    selector: 'novo-quick-note',
    directives: [NgModel, ContentEditableModel],
    inputs: ['config', 'placeholder', 'references'],
    outputs: ['focus', 'blur'],
    template: `
        <div class="quick-note-wrapper">
            <textarea [(ngModel)]="basicNote"
                      (ngModelChange)="onChange($event)"
                      (keyup)="onKeyUp($event)"
                      (keypress)="onKeyPress($event)"
                      (focus)="onFocus($event)"
                      (blur)="onTouched($event)">
            </textarea>
            <div class="quick-note-overlay"
                [innerHTML]="formattedNote"
                [attr.placeholder]="placeholder">
            </div>
            <ref #results></ref>
        </div>
    `
})
export class QuickNote extends OutsideClick {
    // Emitter for selects
    focus:EventEmitter = new EventEmitter();
    blur:EventEmitter = new EventEmitter();

    // Internal search string
    searchTerm:string = '';

    // Placeholders for the callbacks
    _onTouchedCallback = () => false;
    _onChangeCallback = () => false;

    // Results container
    @ViewChild('results', { read: ViewContainerRef }) results:ViewContainerRef;

    constructor(@Optional() model:NgModel, element:ElementRef, componentResolver:ComponentResolver) {
        super(element);
        // NgModel instance
        this.model = model || new NgModel();
        this.model.valueAccessor = this;
        // Component Resolver  Instance
        this.componentResolver = componentResolver;
        // Instance of element
        this.element = element;
        // Bind to the active change event from the OutsideClick
        this.onActiveChange.subscribe(active => {
            if (!active) {
                setTimeout(() => {
                    this.hideResults();
                });
            }
        });
    }

    ngOnInit() {
        // Make sure we have a proper config
        if (!this.config) {
            throw new Error('No config set for QuickNote!');
        }
        // Make sure that we have triggers
        if (!this.config.triggers) {
            throw new Error('QuickNote config must supply triggers!');
        }
        // Make sure that we have triggers
        if (!this.config.options) {
            throw new Error('QuickNote config must supply options!');
        }
        // Custom results template
        this.resultsComponent = this.config.resultsTemplate || QuickNoteResults;
        // Write the value to the model
        this.writeValue(this.model.value);
    }

    onKeyPress(event) {
        // Go over all defined triggers
        let triggers = this.config.triggers || {};
        Object.keys(triggers).forEach(key => {
            let trigger = triggers[key] || {};
            if (event.keyCode === trigger.charCodeAt()) {
                this.isTagging = true;
                this.taggingMode = key;
            }
        });
        return true;
    }

    onChange(event) {
        // Keep the formatted note up-to-date
        this.updateFormattedNote(event);
        return true;
    }

    /**
     * @name onKeyUp
     * @param event - A keyboard event
     *
     * @description This function is called every time the input value changes. We listen for particular keys (e.g. UP
     * arrow, ESC, etc.) to handle certain behaviors of the picker.
     * It made sense to filter these out in the controller instead of using multiple listeners on the HTML element
     * because the quantity of different behaviors would make a messy element.
     */
    onKeyUp(event) {
        // Navigation inside the results
        if (this.quickNoteResults) {
            if (event.keyCode === KeyCodes.ESC) {
                this.hideResults();
                return false;
            }

            if (event.keyCode === KeyCodes.UP) {
                this.quickNoteResults.instance.prevActiveMatch();
                return false;
            }

            if (event.keyCode === KeyCodes.DOWN) {
                this.quickNoteResults.instance.nextActiveMatch();
                return false;
            }

            if (event.keyCode === KeyCodes.ENTER) {
                this.quickNoteResults.instance.selectActiveMatch();
                return false;
            }
        }

        let timer = null;
        clearTimeout(timer);
        if (this.isTagging) {
            timer = setTimeout(() => {
                let searchQuery;
                searchQuery = this.extractSearchQuery();
                if (searchQuery.length) {
                    this.searchTerm = searchQuery;
                    this.showResults();
                } else {
                    this.searchTerm = null;
                    this.hideResults();
                }
            }, 250);
        }
        return true;
    }

    /**
     * @name updateFormattedNote
     * @param value - unformatted text
     *
     * @description - Updates the value inside the div to render the text
     */
    updateFormattedNote(value) {
        // Replace references with anchor tags
        let tempFormattedValue = value;
        let tempBasicValue = value;
        if (this.references) {
            Object.keys(this.references).forEach(key => {
                let array = this.references[key] || [];
                let formatter = (this.config.renderer ? this.config.renderer[key] : null) || this.renderLink;
                this.references[key] = array.filter(item => {
                    let ref = `${this.config.triggers[key]}${item.label}`;
                    let exists = tempFormattedValue.indexOf(ref) !== -1;
                    if (exists) {
                        tempFormattedValue = this.replaceLastOccurrence(tempFormattedValue, ref, formatter(this.config.triggers[key], item));
                    } else {
                        this.taggingMode = key;
                        this.isTagging = true;
                    }
                    return exists;
                });
            });
        }
        // Update formatted value
        this.formattedNote = tempFormattedValue;
        // Update basic note
        this.basicNote = tempBasicValue;
        // Propagate change to ngModel
        if (this.formattedNote) {
            this._onChangeCallback(this.formattedNote);
        } else {
            this._onChangeCallback();
        }
    }

    renderLink(symbol, item) {
        return `<a>${symbol}${item.label}</a>`;
    }

    /**
     * @name extractSearchQuery
     *
     * @description - Gets the search query based on what the user is searching for
     */
    extractSearchQuery() {
        let symbol = this.config.triggers[this.taggingMode];
        return this.basicNote.slice(this.basicNote.lastIndexOf(symbol), this.basicNote.length);
    }

    /**
     * @name onFocus
     * @description When the input's focus event is called this method calls the debounced function that displays the
     * results.
     */
    onFocus(event) {
        this.focus.emit(event);
    }

    /**
     * @name showResults
     *
     * @description This method creates an instance of the results (called popup) and adds all the bindings to that
     * instance.
     */
    showResults() {
        this.toggleActive(null, true);
        // Update Matches
        if (this.quickNoteResults) {
            // Update existing list or create the DOM element
            this.quickNoteResults.instance.term = { searchTerm: this.searchTerm, taggingMode: this.taggingMode };
        } else {
            this.componentResolver.resolveComponent(this.resultsComponent)
                .then(componentFactory => {
                    this.quickNoteResults = this.results.createComponent(componentFactory);
                    this.quickNoteResults.instance.parent = this;
                    this.quickNoteResults.instance.config = this.config;
                    this.quickNoteResults.instance.term = { searchTerm: this.searchTerm, taggingMode: this.taggingMode };
                });
        }
    }

    /**
     * @name hideResults
     *
     * @description - This method deletes the picker results from the DOM.
     */
    hideResults() {
        this.isTagging = false;
        if (this.quickNoteResults) {
            this.quickNoteResults.destroy();
            this.quickNoteResults = null;
        }
    }

    /**
     * @name onSelected
     * @param taggingMode - type of tags we are looking for
     * @param selected - selected value
     *
     * @description - handles the selection from the QuickNoteResults Component
     */
    onSelected(taggingMode, selected) {
        // Turn off tagging
        this.isTagging = false;
        // Reset focus
        this.element.nativeElement.querySelector('textarea').focus();
        // Replace searchTerm
        let symbol = this.config.triggers[this.taggingMode];
        this.basicNote = this.replaceLastOccurrence(this.basicNote, this.searchTerm, `${symbol}${selected.label}`);
        // Reset search term
        this.searchTerm = null;

        // Add the references
        this.references = this.references || {};
        this.references[taggingMode] = this.references[taggingMode] || [];
        this.references[taggingMode].push(selected);

        // Update the formatted note
        this.updateFormattedNote(this.basicNote);
        // Propagate change to ngModel
        this._onChangeCallback(this.formattedNote);
    }

    replaceLastOccurrence(value, key, replaceValue) {
        let index = value.lastIndexOf(key);
        if (index >= 0) {
            return value.substring(0, index) + replaceValue + value.substring(index + key.length);
        }
        return value.toString();
    }

    // Set touched on blur
    onTouched() {
        this.blur.emit(event);
        this._onTouchedCallback();
    }

    // From ControlValueAccessor interface
    writeValue(value) {
        // Update formatted note for the initial value
        if (!this.basicNote) {
            this.updateFormattedNote(value);
        }
        this.basicNote = value;
        if (!value) {
            this._onChangeCallback();
        }
    }

    // From ControlValueAccessor interface
    registerOnChange(fn) {
        this._onChangeCallback = fn;
    }

    // From ControlValueAccessor interface
    registerOnTouched(fn) {
        this._onTouchedCallback = fn;
    }
}

export const NOVO_QUICK_NOTE_ELEMENTS = [QuickNote];
