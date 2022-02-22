import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
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
        return this.http
            .get<Contact[]>(`${this.baseUrl}/contacts`)
            .pipe(catchError(this.handleError));
    }
    getContact(id: number) {
        return this.http
            .get<Contact>(`${this.baseUrl}/contacts/${id}`)
            .pipe(catchError(this.handleError));
    }
    addContact(user: Contact) {
        return this.http
            .post<Contact>(`${this.baseUrl}/contacts`, { ...user })
            .pipe(catchError(this.handleError));
    }
    searchContacts(term: string) {
        return this.http
            .get<Contact[]>(`${this.baseUrl}/contacts?q=${term}`)
            .pipe(catchError(this.handleError));
    }
    editContact(user: Contact) {
        return this.http
            .put<Contact>(`${this.baseUrl}/contacts/${user.id}`, {
                ...user,
            })
            .pipe(catchError(this.handleError));
    }
    deleteContact(id: number) {
        return this.http
            .delete<Contact>(`${this.baseUrl}/contacts/${id}`)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error("An error occurred:", error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, body was: `,
                error.error
            );
        }
        // Return an observable with a user-facing error message.
        return throwError(
            () => new Error("Something bad happened; please try again later.")
        );
    }
}
