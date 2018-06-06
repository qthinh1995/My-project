import configprivate from '../../../internals/config/private'

type State = {
  title: ?string,
  titleBase: ?string,
  description: ?string,
  statusCode: ?number
};

class HelmetStore {

  constructor() {
    this.bindActions(this.alt.getActions('helmet'))

    this.state = {
      title: '',
      titleBase: 'Example project - ',
      description: 'Example project : description',
      statusCode: 200,
      config: configprivate,
      robotTag: ''
    }
  }

  onUpdate(props: State) {
    this.setState({ ...this.state, ...props })
  }

}

export default HelmetStore
