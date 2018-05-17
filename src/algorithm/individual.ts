export class Individual<T> {
  fitness: number = 0;
  genes: Array<T> = [];

  constructor(
    public size: number,
    public randomGene: () => T,
    public fitnessFunction: (index: number) => number,
    public initializeGenes: boolean = true
  ) {
    if (initializeGenes) {
      for (let index = 0; index < size; index++) {
        this.genes.push(this.randomGene());
      }
    }
  }

  calculateFitness(index: number): number {
    this.fitness = this.fitnessFunction(index);
    return this.fitness;
  }

  crossover(otherParent: Individual<T>): Individual<T> {
    const child = new Individual(
      this.size,
      this.randomGene,
      this.fitnessFunction,
      false
    );

    for (let index = 0; index < this.size; index++) {
      child.genes[index] =
        Math.random() < 0.5 ? this.genes[index] : otherParent.genes[index];
    }

    return child;
  }

  mutate(mutationRate: number): void {
    for (let index = 0; index < this.size; index++) {
      if (Math.random() < mutationRate) {
        this.genes[index] = this.randomGene();
      }
    }
  }
}
