import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQueryString, createQueryString } from './helpers';

/**
 * Custom hook for managing form state and validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validate - Validation function
 * @returns {Object} - Form state and handlers
 */
export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  }, []);

  // Handle input blur (mark field as touched)
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
  }, []);

  // Set a specific form value
  const setFieldValue = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  }, []);

  // Set multiple form values at once
  const setMultipleValues = useCallback((newValues) => {
    setValues(prevValues => ({
      ...prevValues,
      ...newValues
    }));
  }, []);

  // Validate form when values or touched fields change
  useEffect(() => {
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  }, [values, validate]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    setMultipleValues,
    resetForm
  };
};

/**
 * Custom hook for managing URL query parameters
 * @param {Object} defaultFilters - Default filter values
 * @returns {Object} - Filters state and handlers
 */
export const useQueryParams = (defaultFilters = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(() => {
    const queryParams = parseQueryString(location.search);
    return { ...defaultFilters, ...queryParams };
  });

  // Update URL when filters change
  useEffect(() => {
    const queryString = createQueryString(filters);
    navigate(`${location.pathname}?${queryString}`, { replace: true });
  }, [filters, location.pathname, navigate]);

  // Handle filter change
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  }, []);

  // Set a specific filter value
  const setFilterValue = useCallback((name, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  }, []);

  // Set multiple filter values at once
  const setMultipleFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  return {
    filters,
    setFilters,
    handleFilterChange,
    setFilterValue,
    setMultipleFilters,
    clearFilters
  };
};

/**
 * Custom hook for handling API requests with loading and error states
 * @param {Function} apiFunction - API function to call
 * @param {Array} dependencies - Dependencies array for useEffect
 * @returns {Object} - Data, loading, error, and refetch function
 */
export const useFetch = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  // Reset state when dependencies change
  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);
  }, dependencies);

  const fetchData = useCallback(async (...args) => {
    if (!isMounted.current) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      if (isMounted.current) {
        setData(result);
        setLoading(false);
      }
      return result;
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
      return null;
    }
  }, [apiFunction]);

  useEffect(() => {
    isMounted.current = true;
    fetchData();
    
    return () => {
      isMounted.current = false;
    };
  }, [...dependencies, fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for handling infinite scrolling
 * @param {Function} fetchMore - Function to fetch more items
 * @param {boolean} hasMore - Whether there are more items to load
 * @param {number} threshold - Distance from bottom to trigger loading (in pixels)
 * @returns {Object} - Reference to attach to the scrollable element and loading state
 */
export const useInfiniteScroll = (fetchMore, hasMore, threshold = 200) => {
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const lastElementRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setLoading(true);
        fetchMore().finally(() => setLoading(false));
      }
    }, { rootMargin: `0px 0px ${threshold}px 0px` });
    
    if (node) {
      observer.current.observe(node);
    }
  }, [loading, fetchMore, hasMore, threshold]);

  return { lastElementRef, loading };
};

/**
 * Custom hook for handling local storage state
 * @param {string} key - Local storage key
 * @param {any} initialValue - Initial value
 * @returns {Array} - State value and setter function
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

/**
 * Custom hook for handling click outside of a component
 * @param {Function} callback - Function to call when clicked outside
 * @returns {Object} - Reference to attach to the component
 */
export const useClickOutside = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};

/**
 * Custom hook for handling window resize events
 * @returns {Object} - Window dimensions
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
