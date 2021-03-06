import { FuseNavigation } from "@fuse/types";

export const navigation: FuseNavigation[] = [
    {
        id: "applications",
        title: "Applications",
        translate: "NAV.APPLICATIONS",
        type: "group",
        children: [
            {
                id: "sample",
                title: "Sample",
                translate: "NAV.SAMPLE.TITLE",
                type: "item",
                icon: "email",
                url: "/sample",
                badge: {
                    title: "25",
                    translate: "NAV.SAMPLE.BADGE",
                    bg: "#F44336",
                    fg: "#FFFFFF",
                },
            },
            {
                id: "contacts",
                title: "Contacts",
                translate: "NAV.CONTACTS.TITLE",
                type: "item",
                icon: "account_box",
                url: "/apps/contacts",
                badge: {
                    title: null,
                    translate: "NAV.CONTACTS.BADGE",
                    bg: "#F44336",
                    fg: "#FFFFFF",
                },
            },
        ],
    },
];
