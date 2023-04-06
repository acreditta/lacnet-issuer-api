import Router from "./router.js";
import { didService } from "../services/index.js";

export default class DIDRouter extends Router {

  constructor( logger ) {
    super( logger );
  }

  init() {
    this.post( '/create', 'PUBLIC', this.create );
  }

  async create( req ) {
    const {  credentialsRegistry } = req.body;
    return didService.create( credentialsRegistry );
  }

}