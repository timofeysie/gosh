import { addArticle } from '../actions/index';
import { ADD_ARTICLE } from '../constants/action-types';

describe('actions', () => {
  it('should create an action to add a todo', () => {
    const text = 'Finish docs'
    const expectedAction = {
      type: ADD_ARTICLE,
      text
    }
    expect(actions.addTodo(text)).toEqual(expectedAction)
  })
})
