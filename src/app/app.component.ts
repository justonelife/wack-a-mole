import { ChangeDetectionStrategy, Component, OnInit, Signal, WritableSignal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, delayWhen, interval, merge, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'wack-a-mole';
  readonly #CELL_QUANTITY: number = 9;
  cells = new Array(this.#CELL_QUANTITY);
  molePosition: WritableSignal<number> = signal(this.#getRandomCell());
  score: WritableSignal<number> = signal(0);
  hit$: Subject<null> = new Subject();
  totalHit: WritableSignal<number> = signal(0);
  acc: Signal<number> = computed(() => {
    if (this.totalHit() > 0) {
      return this.score() / this.totalHit();
    }
    return 0;
  })

  ngOnInit(): void {
    interval(500)
    .pipe(
      delayWhen(() => merge(this.hit$, timer(500)))
    )
    .subscribe({
      next: _ =>{console.log(_); this.molePosition.update(_ => this.#getRandomCell())}
    })
  }

  #getRandomCell(): number {
    return Math.floor(Math.random() * this.#CELL_QUANTITY);
  }

  hit(cellIndex: number): void {
    this.totalHit.update(val => val + 1);
    if (cellIndex === this.molePosition()) {
      this.score.update(val => val + 1);
      this.hit$.next(null);
    }
  }
}
