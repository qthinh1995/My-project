class UsersStore {

  constructor() {
    this.bindActions(this.alt.getActions('users'))

    this.users = []
    this.error = null
  }


  onIndexSuccess(users: Object[]) {
    this.users = users
    this.error = null
  }

  onIndexFail({ error }: { error: ?Object }) {
    this.error = error
  }

  onShowSuccess(users: { seed: string }) {
    const index = this.users
      .findIndex(({ seed }) => seed === users.seed)

    if (index > -1) {
      this.users = this.users
        .map((u, idx) => idx === index ? users : u)
    } else {
      this.users = [ ...this.users, users ]
    }

    this.error = null
  }

  onShowFail({ error }: { error: ?Object }) {
    this.error = error
  }

  onRemove(index: number) {
    this.users = this.users
      .filter((user, idx) => idx !== index)
  }

}

export default UsersStore
