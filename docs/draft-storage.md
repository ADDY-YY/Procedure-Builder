# Draft storage and recovery

Drafts are stored in IndexedDB under a generated document ID; titles are display names and do not need to be unique. Existing localStorage drafts are migrated once when the application next opens. A malformed legacy record is discarded so it cannot block access to valid current drafts. Images remain part of the structured draft until image records are moved to a separate IndexedDB store.

The editor writes a short-lived recovery copy to session storage before automatic persistence completes. A later session can offer that recovery copy if it is newer than the stored draft. Browser storage is local to the browser profile and is not a backup. Use Project Backup to make portable copies.

Deleting a draft permanently removes its local record after confirmation. The MVP has no recycle bin.
