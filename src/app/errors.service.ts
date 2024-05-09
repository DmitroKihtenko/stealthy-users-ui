import { Injectable } from '@angular/core';
import {Observable, Subject, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {ConfigService} from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {
  private errors: Subject<string[]> = new Subject<string[]>();
  private hidden: Subject<boolean> = new Subject<boolean>();
  private lastErrors: string[] = [];
  private lastHidden: boolean = true;
  showOnInit: boolean = false;

  constructor(
    private router: Router,
    private configService: ConfigService
  ) {
    this.getErrorsObservable().subscribe(
      {next: value => this.lastErrors = value}
    );
    this.getHiddenObservable().subscribe(
      {next: value => this.lastHidden = value}
    );
  }

  setErrors(errors: string[]) {
    this.errors.next(errors);
  }

  getErrors(): string[] {
    return this.lastErrors;
  }

  getErrorsObservable(): Observable<string[]> {
    return this.errors.asObservable();
  }

  setHidden(hidden: boolean) {
    this.hidden.next(hidden);
  }

  getHidden(): boolean {
    return this.lastHidden;
  }

  getHiddenObservable(): Observable<boolean> {
    return this.hidden.asObservable();
  }

  capitalize(word: string) {
    if (word.length > 0) {
      return word.charAt(0).toUpperCase() + word.substring(1);
    } else {
      return word;
    }
  }

  snake_case_to_readable(value: string): string {
    let words = value.match(/[A-Za-z][a-z]*/g) || [];
    let filteredWords = []
    let firstWord = true;
    for (let word of words) {
      if (word.length > 0) {
        if (firstWord) {
          filteredWords.push(this.capitalize(word));
          firstWord = false;
        } else {
          filteredWords.push(word);
        }
      }
    }
    if (filteredWords.length > 0) {
      filteredWords[0].charAt(0).toUpperCase();
    }

    return filteredWords.join(" ");
  }

  parseErrorsFromResponse(response: any): string[] {
    const result: string[] = [];
    try {
      for (const detail of response.detail) {
        let errorLine = this.snake_case_to_readable(detail.name);
        if (errorLine != "") {
          errorLine += ": " + detail.message;
        }
        result.push(errorLine);
      }
    } catch (error) {
      try {
        result.push(response.summary)
      } catch (error) {
        result.push('Unknown user error');
      }
    }
    return result;
  }

  handleError(error: any, errorJson: any, status: number) {
    if (status == 0) {
      this.setErrors(['Server unavailable']);
      this.setHidden(false);
    } else {
      this.setErrors(
        this.parseErrorsFromResponse(errorJson)
      );
      this.setHidden(false);
      if (status >= 500) {
        this.showOnInit = true;
        this.router.navigateByUrl(
          this.configService.config.routing.baseUrl + '/error'
        );
      }
    }
    return throwError(() => error);
  }
}
