import { GeneticAlgorithm } from './algorithm';

export class Main<T> {
  mutationRate = 0.01;
  elitism = 5;

  ga: GeneticAlgorithm<T>;

  constructor(
    public populationSize: number,
    public targetArray: Array<T>,
    public validInputs: Array<T>,
    randomGene: () => T
  ) {
    this.ga = new GeneticAlgorithm<T>(
      this.populationSize,
      targetArray.length,
      randomGene,
      this.fitnessFunction,
      this.elitism,
      this.mutationRate
    );
  }

  fitnessFunction = (index: number) => {
    let score = 0;
    const individual = this.ga.population[index];

    for (let i = 0; i < individual.genes.length; i++) {
      if (individual.genes[i] === this.targetArray[i]) {
        score += 1;
      }
    }

    score /= this.targetArray.length;
    score = Math.pow(2, score) - 1;
    return score;
  };

  next = () => this.ga.newGeneration();
}
