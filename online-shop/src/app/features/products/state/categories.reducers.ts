import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { Category } from '../types/product-category.types';
import { CategoryActions } from './products.actions';

export interface CategoriesState extends EntityState<Category> {
  isLoading: boolean;
  error: string | null;
}

export const categoriesAdapter = createEntityAdapter<Category>({
  selectId: (category) => category.id,
});

export const initialCategoriesState: CategoriesState = categoriesAdapter.getInitialState({
  isLoading: false,
  error: null,
});

export const categoriesFeature = createFeature({
  name: 'categories',
  reducer: createReducer(
    initialCategoriesState,
    on(CategoryActions.loadCategories, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(CategoryActions.loadCategoriesSuccess, (state, { categories }) =>
      categoriesAdapter.setAll(categories, {
        ...state,
        isLoading: false,
        error: null,
      }),
    ),
    on(CategoryActions.loadCategoriesFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),
  ),
});

export const { name, reducer } = categoriesFeature;

const { selectAll, selectEntities, selectTotal } = categoriesAdapter.getSelectors(
  categoriesFeature.selectCategoriesState,
);

export const selectCategoryList = selectAll;
export const selectCategoryEntities = selectEntities;
export const selectCategoryCount = selectTotal;
export const selectCategoriesLoading = categoriesFeature.selectIsLoading;
export const selectCategoriesError = categoriesFeature.selectError;
