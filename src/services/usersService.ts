import boom from "@hapi/boom";
import { DID, DIDRecoverable, Resolver } from '@lacchain/did'

class UsersService {
  users: any[];
  constructor() {
    this.users = [
      {
        id: 1,
        name: 'Sherlock Holmes',
        email: 'sherlock.holmes@oilnetsoftware.com'
      },
      {
        id: 2,
        name: 'John Watson',
        email: 'john.watson@oilnetsoftware.com'
      },
    ];
  }

  async create(user: any) {
    const did = new DID( {
      registry: '0xbDa1238272FDA6888556449Cb77A87Fc8205E8ba',
      rpcUrl: 'https://writer.lacchain.net',
      network: 'main'
    } );
    const id = this.users.length + 1;
    const t = await did.createDID();
    const newUser = { id, ...user, did: did.id };
    this.users.push(newUser);
    return newUser;
  }

  async find() {
    return this.users;
  }

  async findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw boom.notFound("Not found");
    return this.users.find((user) => user.id === id);
  }

  async update(id: number, changes: any) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) throw boom.notFound("Not found");
    const user = this.users[index];
    this.users[index] = { ...user, ...changes };
    return this.users[index];
  }

  async delete(id: number) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) throw boom.notFound("Not found");
    this.users.splice(index, 1);
    return { message: "Deleted" };
  }
}

export default UsersService;