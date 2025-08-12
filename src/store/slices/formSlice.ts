import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { 
  FormState, 
  FormData, 
  SetFormDataPayload, 
  SetValidationErrorsPayload 
} from '../types';

// Initial state
const initialState: FormState = {
  forms: {},
  validationErrors: {},
  isSubmitting: {},
};

// Create the slice
const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    // Set form data
    setFormData: (state, action: PayloadAction<SetFormDataPayload>) => {
      const { formId, data } = action.payload;
      if (!state.forms[formId]) {
        state.forms[formId] = {
          values: {},
          touched: {},
          errors: {},
        };
      }
      state.forms[formId] = { ...state.forms[formId], ...data };
    },
    
    // Set form field value
    setFormField: (state, action: PayloadAction<{ formId: string; field: string; value: unknown }>) => {
      const { formId, field, value } = action.payload;
      if (!state.forms[formId]) {
        state.forms[formId] = {
          values: {},
          touched: {},
          errors: {},
        };
      }
      state.forms[formId].values[field] = value;
    },
    
    // Set form field touched state
    setFieldTouched: (state, action: PayloadAction<{ formId: string; field: string; touched: boolean }>) => {
      const { formId, field, touched } = action.payload;
      if (!state.forms[formId]) {
        state.forms[formId] = {
          values: {},
          touched: {},
          errors: {},
        };
      }
      state.forms[formId].touched[field] = touched;
    },
    
    // Set form field error
    setFieldError: (state, action: PayloadAction<{ formId: string; field: string; error: string }>) => {
      const { formId, field, error } = action.payload;
      if (!state.forms[formId]) {
        state.forms[formId] = {
          values: {},
          touched: {},
          errors: {},
        };
      }
      state.forms[formId].errors[field] = error;
    },
    
    // Set validation errors for a form
    setValidationErrors: (state, action: PayloadAction<SetValidationErrorsPayload>) => {
      const { formId, errors } = action.payload;
      state.validationErrors[formId] = errors;
    },
    
    // Clear form errors
    clearFormErrors: (state, action: PayloadAction<string>) => {
      const formId = action.payload;
      if (state.forms[formId]) {
        state.forms[formId].errors = {};
      }
      delete state.validationErrors[formId];
    },
    
    // Set form submitting state
    setFormSubmitting: (state, action: PayloadAction<{ formId: string; isSubmitting: boolean }>) => {
      const { formId, isSubmitting } = action.payload;
      state.isSubmitting[formId] = isSubmitting;
    },
    
    // Reset form
    resetForm: (state, action: PayloadAction<string>) => {
      const formId = action.payload;
      delete state.forms[formId];
      delete state.validationErrors[formId];
      delete state.isSubmitting[formId];
    },
    
    // Reset all forms
    resetAllForms: (state) => {
      return initialState;
    },
  },
});

// Export actions
export const {
  setFormData,
  setFormField,
  setFieldTouched,
  setFieldError,
  setValidationErrors,
  clearFormErrors,
  setFormSubmitting,
  resetForm,
  resetAllForms,
} = formSlice.actions;

// Export reducer
export default formSlice.reducer;

// Memoized selectors for better performance
export const selectForm = (formId: string) => createSelector(
  [(state: { form: FormState }) => state.form.forms[formId]],
  (form) => form || { values: {}, touched: {}, errors: {} }
);

export const selectFormValues = (formId: string) => createSelector(
  [(state: { form: FormState }) => state.form.forms[formId]?.values],
  (values) => values || {}
);

export const selectFormErrors = (formId: string) => createSelector(
  [(state: { form: FormState }) => state.form.forms[formId]?.errors],
  (errors) => errors || {}
);

export const selectFormTouched = (formId: string) => createSelector(
  [(state: { form: FormState }) => state.form.forms[formId]?.touched],
  (touched) => touched || {}
);

export const selectFormField = (formId: string, field: string) => createSelector(
  [(state: { form: FormState }) => state.form.forms[formId]?.values[field]],
  (value) => value
);

export const selectFormFieldError = (formId: string, field: string) => createSelector(
  [(state: { form: FormState }) => state.form.forms[formId]?.errors[field]],
  (error) => error
);

export const selectFormFieldTouched = (formId: string, field: string) => createSelector(
  [(state: { form: FormState }) => state.form.forms[formId]?.touched[field]],
  (touched) => touched || false
);

export const selectIsFormSubmitting = (formId: string) => createSelector(
  [(state: { form: FormState }) => state.form.isSubmitting[formId]],
  (isSubmitting) => isSubmitting || false
);

export const selectValidationErrors = (formId: string) => createSelector(
  [(state: { form: FormState }) => state.form.validationErrors[formId]],
  (errors) => errors || {}
);
