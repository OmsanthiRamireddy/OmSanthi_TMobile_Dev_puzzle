import { Component, OnInit , ChangeDetectorRef, ChangeDetectionStrategy, NgZone} from '@angular/core';
import { Store } from '@ngrx/store';
import * as ReadingListActions from '../../../../data-access/src/lib/+state/books.effects';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  removeFromReadingList,
  searchBooks,
  undoFromList
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],changeDetection: ChangeDetectionStrategy.Default,
})
export class BookSearchComponent implements OnInit {
  books: ReadingListBook[];
  addedToReadingList = false;
  searchForm = this.fb.group({
    term: ''
  });
  buttonName: string = 'Want to Read';
  isUndo: boolean = false;

 
  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}
  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.store.select(getAllBooks).subscribe(books => {
      this.books = books;
    });
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book:Book) {
    this.store.dispatch(addToReadingList({ book }));
    this.snackBar.open(book.title + "  added to ReadingList.", 'Close', {
      duration: 2000,
    });
    if(book.isAdded){
      // book.isAdded==false;
      this.store.dispatch(undoFromList({ book }));
      this.snackBar.open(book.title + "  removed from ReadingList.", 'Close', {
        duration: 2000,
      });
      
   }
   console.log(book)
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
  undo(book){
    const id=book.id;
    // this.store.dispatch(ReadingListActions.undoReadingList({ id }));

    book.wantToRead = !book.wantToRead;
    this.snackBar.open(book.title + "  added to want to Read List.", 'Close', {
      duration: 2000,
    });
    this.addedToReadingList = false;}
    
}
