import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatDialogModule, MatButtonModule],
  selector: 'app-confirmation-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onDismiss()">Cancel</button>
      <button mat-flat-button color="warn" (click)="onConfirm()">Delete</button>
    </mat-dialog-actions>`,
})
export class ConfirmationDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  public readonly data = inject(MAT_DIALOG_DATA);

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
