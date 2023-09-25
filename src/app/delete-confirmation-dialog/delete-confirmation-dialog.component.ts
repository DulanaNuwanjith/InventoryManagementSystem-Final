import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-delete-confirmation-dialog',
    templateUrl: './delete-confirmation-dialog.component.html',
})
export class DeleteConfirmationDialogComponent {

    adminPassword: string = '';
    showError: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar
    ) { }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    // onYesClick(): void {
    //     if (this.adminPassword === 'delete123') {
    //         this.snackBar.open('Successfully deleted', 'Close', {
    //             duration: 3000,
    //             horizontalPosition: 'center',
    //             verticalPosition: 'top',
    //         });
    //         this.dialogRef.close(true);
    //     } else {
    //         this.showError = true;
    //     }
    // }

    onYesClick(): void {
        this.snackBar.open('Successfully deleted', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });
        this.dialogRef.close(true);
    }

}
