import { Component, OnInit } from "@angular/core";

import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";

import { locale as english } from "./i18n/en";
import { locale as turkish } from "./i18n/tr";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { ContactsService } from "app/config/contacts.servoce";
import { Contact } from "app/types/contacts";

@Component({
    selector: "app-contact",
    templateUrl: "./contact.component.html",
    styleUrls: ["./contact.component.scss"],
})
export class ContactComponent implements OnInit {
    public contactDetails: Contact = {
        id: null,
        name: "",
        phone: "",
        email: "",
    };
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private contactsService: ContactsService,

        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get("id"));
        this.contactsService
            .getContact(id)
            .subscribe((data) => (this.contactDetails = data));
    }
}
