import Authentication from '../middlewares/Authentication';
import Document from '../../controllers/DocumentController';

export default (app) => {
  // Documents API Endpoints
  app.post('/document', Authentication.verifyToken,
    Authentication.validateDocumentsInput, Document.createNew);
};
