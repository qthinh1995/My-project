class NewsStore {

  constructor() {
    this.bindActions(this.alt.getActions('news'))

    this.collection = []
    this.error = null
  }


  onIndexSuccess(news: Object[]) {
    this.collection = news
    this.error = null
  }

  onIndexFail({ error }: { error: ?Object }) {
    this.error = error
  }

  onShowSuccess(news: { id: string }) {
    const index = this.collection
      .findIndex(({ id }) => id === news.id)

    if (index > -1) {
      this.collection = this.collection
        .map((u, idx) => idx === index ? news : u)
    } else {
      this.collection = [ ...this.collection, news ]
    }

    this.error = null
  }

  onShowFail({ error }: { error: ?Object }) {
    this.error = error
  }

  onRemove(index: number) {
    this.collection = this.collection
      .filter((user, idx) => idx !== index)
  }

}

export default NewsStore
