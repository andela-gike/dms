// @flow
import models from '../index';

describe('Create Model', () => {
  it('should have a user model', () => {
    expect(models.User).toBeDefined();
    expect(models.User).toExist;
  });
  it('should have a document model', () => {
    expect(models.Document).toBeDefined();
    expect(models.Document).toExist;
  });
  it('should have a role model', () => {
    expect(models.Role).toBeDefined();
    expect(models.Role).toExist;
  });
});
