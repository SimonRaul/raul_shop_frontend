import { Category } from '../types/product-category.types';
import { CategoryActions } from './products.actions';
import {
  categoriesAdapter,
  initialCategoriesState,
  reducer,
  selectCategoryList,
} from './categories.reducers';

describe('categoriesReducer', () => {
  const category: Category = {
    id: 'category-1',
    name: 'Furniture',
    description: 'Furniture products',
  };

  it('loads categories into normalized state', () => {
    let state = reducer(initialCategoriesState, CategoryActions.loadCategories());
    expect(state).toMatchObject({ ids: [], isLoading: true, error: null });

    state = reducer(state, CategoryActions.loadCategoriesSuccess({ categories: [category] }));
    expect(state).toMatchObject({
      ids: [category.id],
      entities: { [category.id]: category },
      isLoading: false,
      error: null,
    });
  });

  it('preserves categories when loading fails', () => {
    const populatedState = categoriesAdapter.setOne(category, initialCategoriesState);
    const state = reducer(
      populatedState,
      CategoryActions.loadCategoriesFailure({ error: 'Unable to load' }),
    );

    expect(state.entities[category.id]).toEqual(category);
    expect(state).toMatchObject({ isLoading: false, error: 'Unable to load' });
  });

  it('denormalizes the category list', () => {
    const state = categoriesAdapter.setOne(category, initialCategoriesState);

    expect(selectCategoryList({ categories: state })).toEqual([category]);
  });
});
