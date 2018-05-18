import * as React from 'react';
import { Layout, Card, List, Input, Button } from 'antd';
import { Main } from '../algorithm/main';
import { GeneticAlgorithm } from '../algorithm/algorithm';

const { Header, Footer, Sider, Content } = Layout;

interface HomeProps {}

interface HomeState {
  target: string;
  maxIteration: number;
  nbPopulation: number;
  result: GeneticAlgorithm<string> | any;
  launching: boolean;
  executionTime: number;
}

const VALID_INPUTS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.|!#$%&/()=? ';

const initialState = {
  target: 'To be or not to be.',
  maxIteration: 10000,
  nbPopulation: 100,
  result: null,
  launching: false,
  executionTime: 0,
};

export class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: any) {
    super(props);

    this.state = initialState;
  }

  handleTargetChange = (event: any) => {
    const { value } = event.target;
    this.setState({ target: value });
  };

  handleMaxIterationChange = (event: any) => {
    const { value } = event.target;
    this.setState({ maxIteration: parseInt(value, 10) });
  };

  handleNbPopulationChange = (event: any) => {
    const { value } = event.target;
    this.setState({ nbPopulation: parseInt(value, 10) });
  };

  handleLaunchSearch = () => {
    this.setState({ launching: true });
    const start = new Date();

    const launcher = new Main<string>(
      this.state.nbPopulation,
      this.state.target.split(''),
      VALID_INPUTS.split(''),
      this.randomCharacter
    );

    console.time('Iteration');

    for (let index = 0; index < this.state.maxIteration; index++) {
      launcher.next();
      if (launcher.ga.bestFitness === 1) {
        break;
      }
      if (index === this.state.maxIteration - 1) {
        console.log('Reach the maximum iteration.');
      }
    }

    this.setState({ result: launcher.ga, executionTime: new Date() - start });

    console.timeEnd('Iteration');
    console.log('Best fitness', launcher.ga.bestFitness);
    console.log('Generic Algorithm', launcher.ga.bestGenes);
    console.log('Generation', launcher.ga.generation);
    console.log('Population', launcher.ga.newPopulation);

    this.setState({ launching: false });
  };

  handleReset = () => {
    this.setState({ ...initialState });
  };

  randomCharacter = () => {
    const randomIndex = Math.floor(Math.random() * VALID_INPUTS.length);
    const randomGene = VALID_INPUTS[randomIndex];
    return randomGene;
  };

  render() {
    return (
      <React.Fragment>
        <Layout>
          <Header className="Header">Genetic Algorithm with React</Header>
          <Content className="Content">
            <Card style={{ width: 400 }}>
              <label>Target text</label>
              <Input
                type="text"
                value={this.state.target}
                placeholder="Target text..."
                onChange={this.handleTargetChange}
                className="Input"
              />

              <label>Maximum iteration</label>
              <Input
                type="number"
                value={this.state.maxIteration}
                onChange={this.handleMaxIterationChange}
                placeholder="Max iteration..."
                className="Input"
              />

              <label>Number of population</label>
              <Input
                type="number"
                value={this.state.nbPopulation}
                onChange={this.handleNbPopulationChange}
                placeholder="Number of population..."
                className="Input"
              />

              <Button
                className="Button"
                type="danger"
                onClick={this.handleLaunchSearch}
                disabled={this.state.launching}
              >
                Launch search
              </Button>

              <Button
                className="Button"
                type="danger"
                onClick={this.handleReset}
                disabled={this.state.launching}
              >
                Reset
              </Button>
            </Card>
          </Content>
          <Footer className="Footer">
            {this.state.result && (
              <List
                className="Result"
                header={<strong>Result</strong>}
                bordered
                dataSource={[
                  `Best fitness: ${this.state.result.bestFitness}`,
                  `Best genes: ${this.state.result.bestGenes.join('')}`,
                  `Generation: ${this.state.result.generation}`,
                  `Execution time: ${this.state.executionTime} ms`,
                ]}
                renderItem={(item: string) => <List.Item>{item}</List.Item>}
              />
            )}
          </Footer>
        </Layout>
      </React.Fragment>
    );
  }
}
