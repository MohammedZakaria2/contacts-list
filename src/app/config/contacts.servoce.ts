import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { Contact } from "app/types/contacts";

@Injectable({
    providedIn: "root",
})
export class ContactsService {
    private baseUrl = "https://api-app-0001.herokuapp.com";
    constructor(private http: HttpClient) {}
    getContacts() {
        return this.http.get<Contact[]>(`${this.baseUrl}/contacts`);
    }
    getContact(id: number) {
        return this.http.get<Contact>(`${this.baseUrl}/contacts/${id}`);
    }
    addContact(user: Contact) {
        return this.http.post<Contact>(`${this.baseUrl}/contacts`, { ...user });
    }
    searchContacts(term: string) {
        return this.http.get<Contact[]>(`${this.baseUrl}/contacts?q=${term}`);
    }
    editContact(user: Contact) {
        return this.http.put<Contact>(`${this.baseUrl}/contacts/${user.id}`, {
            ...user,
        });
    }
    deleteContact(id: number) {
        return this.http.delete<Contact>(`${this.baseUrl}/contacts/${id}`);
    }
}
