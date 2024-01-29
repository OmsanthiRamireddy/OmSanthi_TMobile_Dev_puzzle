import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList } from '@tmo/books/data-access';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(private readonly store: Store,
    public snackBar: MatSnackBar) {}

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
    this.snackBar.open(item.title + "  removed from ReadingList.", 'Close', {
      duration: 2000,
    });
  }
}
