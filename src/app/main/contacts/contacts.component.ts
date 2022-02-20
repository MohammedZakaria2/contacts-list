import { Component, OnInit } from "@angular/core";

import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";

import { locale as english } from "./i18n/en";
import { locale as turkish } from "./i18n/tr";
import { ContactsService } from "app/config/contacts.servoce";
import { Contact } from "app/types/contacts";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-contacts",
    templateUrl: "./contacts.component.html",
    styleUrls: ["./contacts.component.scss"],
})
export class ContactsComponent implements OnInit {
    public contacts = [];
    // hold contacts in one array for editing contacts
    public extraArrayForEditingPurposesContacts = [];
    // for toggling form
    public isFormOpen = false;
    public length = 0;
    public formType = "";
    public onDeleteContactId = null;
    public confirmModal = false;

    contactForm = new FormGroup({
        id: new FormControl(""),
        name: new FormControl("", [Validators.required]),
        email: new FormControl("", [Validators.required]),
        phone: new FormControl("", [Validators.required]),
    });

    get name() {
        return this.contactForm.get("name");
    }
    get phone() {
        return this.contactForm.get("phone");
    }
    get email() {
        return this.contactForm.get("email");
    }
    get id() {
        return this.contactForm.get("id");
    }

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private contactsService: ContactsService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }

    ngOnInit(): void {
        this.fetchContacts();
    }

    fetchContacts() {
        this.contactsService.getContacts().subscribe((data) => {
            this.extraArrayForEditingPurposesContacts = data;
            this.setUpList(data);
        });
    }

    search(term: string) {
        this.contactsService.searchContacts(term).subscribe((data) => {
            this.setUpList(data);
        });
    }

    onSubmit() {
        if (this.formType === "add") {
            this.contactsService
                .addContact(this.contactForm.value)
                .subscribe((data) => this.onContactAdded(data));
            this.emptyForm();
            this.closeForm();
        } else if (this.formType === "edit") {
            this.contactsService
                .editContact(this.contactForm.value)
                .subscribe((data) => this.onContactEdited(data));
            this.emptyForm();
            this.closeForm();
        }
    }

    onDeleteContact(id: number) {
        this.onDeleteContactId = id;
        this.openModal(id);
    }

    confirmDelete() {
        if (this.onDeleteContactId) {
            this.contactsService
                .deleteContact(this.onDeleteContactId)
                .subscribe(() => this.onContactDeleted(this.onDeleteContactId));
            this.closeModal();
        }
    }

    editContact(id: number) {
        this.openForm("edit");
        this.contactsService
            .getContact(id)
            .subscribe((data) => this.setForm(data));
    }

    onContactAdded(contact: Contact) {
        this.length++;
        const index = this.contacts.findIndex(
            (item) => item.char === contact.name[0].toUpperCase()
        );
        this.extraArrayForEditingPurposesContacts = [
            ...this.extraArrayForEditingPurposesContacts,
            contact,
        ];
        if (index === -1) {
            this.contacts.push({
                char: contact.name[0].toUpperCase(),
                items: [contact],
            });
        } else {
            this.contacts[index].items.push(contact);
        }
        this.sortContact();
    }

    onContactEdited(contact: Contact) {
        this.extraArrayForEditingPurposesContacts =
            this.extraArrayForEditingPurposesContacts.map((item) => {
                if (item.id === contact.id) {
                    return (item = contact);
                } else {
                    return item;
                }
            });

        this.setUpList(this.extraArrayForEditingPurposesContacts);
        this.sortContact();
    }

    onContactDeleted(id: number) {
        this.extraArrayForEditingPurposesContacts =
            this.extraArrayForEditingPurposesContacts.filter(
                (item) => item.id !== id
            );
        this.length--;

        this.setUpList(this.extraArrayForEditingPurposesContacts);
        this.sortContact();
    }

    setUpList(list: Contact[]) {
        this.length = list.length;
        const elephant = [
            ...new Set(list.map((item) => item.name[0].toUpperCase())),
        ];
        this.contacts = elephant.map((elpha) => {
            const items = list.filter((item) => {
                if (elpha === item.name[0].toUpperCase()) return item;
            });
            return { char: elpha, items: items };
        });
        this.sortContact();
    }

    emptyForm() {
        this.id.setValue("");
        this.name.setValue("");
        this.email.setValue("");
        this.phone.setValue(null);
    }

    setForm(contact: Contact) {
        this.id.setValue(contact.id);
        this.name.setValue(contact.name);
        this.email.setValue(contact.email);
        this.phone.setValue(contact.phone);
    }

    openForm(type: string) {
        if (type === "add") {
            this.emptyForm();
        }

        this.formType = type;
        this.isFormOpen = true;
    }

    closeForm() {
        this.isFormOpen = false;
        this.formType = "";
    }

    sortContact() {
        this.contacts = this.contacts.sort((a, b) =>
            a.char > b.char ? 1 : -1
        );
    }

    openModal(id) {
        this.confirmModal = id;
    }

    closeModal() {
        this.confirmModal = false;
    }
}
