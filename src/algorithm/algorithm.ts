import { Individual } from './individual';

export class GeneticAlgorithm<T> {
  population: Array<Individual<T>> = [];
  generation: number = 0;
  bestFitness: number = 0.0;
  bestGenes: Array<T> = [];

  elitism: number = 0.0;
  mutationRate: number = 0.0;

  newPopulation: Array<Individual<T>> = [];
  fitnessSum: number = 0.0;
  individualSize: number = 0;
  randomGene: () => T;
  fitnessFunction: (index: number) => number;

  constructor(
    populationSize: number,
    individualSize: number,
    randomGene: () => T,
    fitnessFunction: (index: number) => number,
    elitism: number,
    mutationRate = 0.01
  ) {
    this.generation = 0;
    this.elitism = elitism;
    this.mutationRate = mutationRate;
    this.individualSize = individualSize;
    this.randomGene = randomGene;
    this.fitnessFunction = fitnessFunction;

    for (let i = 0; i < populationSize; i++) {
      this.population.push(
        new Individual<T>(individualSize, randomGene, fitnessFunction, true)
      );
    }
  }

  newGeneration(
    numNewIndividual: number = 0,
    crossoverNewIndividual: boolean = false
  ): void {
    const finalCount = this.population.length + numNewIndividual;

    if (finalCount <= 0) {
      return;
    }

    if (this.population.length > 0) {
      this.calculateFitness();
      this.population.sort(this.compareIndividual);
    }

    this.newPopulation = [];

    for (let i = 0; i < this.population.length; i++) {
      if (i < this.elitism && i < this.population.length) {
        this.newPopulation.push(this.population[i]);
      } else if (i < this.population.length || crossoverNewIndividual) {
        const parent1 = this.chooseParent();
        const parent2 = this.chooseParent();

        const child = parent1.crossover(parent2);

        child.mutate(this.mutationRate);

        this.newPopulation.push(child);
      } else {
        this.newPopulation.push(
          new Individual<T>(
            this.individualSize,
            this.randomGene,
            this.fitnessFunction,
            true
          )
        );
      }
    }

    let tmpList = this.population;
    this.population = this.newPopulation;
    this.newPopulation = tmpList;

    this.generation++;
  }

  private compareIndividual(a: Individual<T>, b: Individual<T>): number {
    if (a.fitness > b.fitness) {
      return -1;
    } else if (a.fitness < b.fitness) {
      return 1;
    } else {
      return 0;
    }
  }

  private calculateFitness(): void {
    this.fitnessSum = 0;
    let best = this.population[0];

    for (let i = 0; i < this.population.length; i++) {
      this.fitnessSum += this.population[i].calculateFitness(i);

      if (this.population[i].fitness > best.fitness) {
        best = this.population[i];
      }
    }

    this.bestFitness = best.fitness;
    this.bestGenes = best.genes;
  }

  private chooseParent(): Individual<T> | any {
    let randomNumber = Math.random() * this.fitnessSum;
    for (let i = 0; i < this.population.length; i++) {
      if (randomNumber < this.population[i].fitness) {
        return this.population[i];
      }

      randomNumber -= this.population[i].fitness;
    }

    return null;
  }
}
