import { useState } from 'react';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Form, Header, Input, SearchBtn, Span } from './Searchbar.styled';

export const Searchbar = ({ onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = e => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (searchQuery.trim() === '') {
      Report.failure(
        'Sorry',
        'Sorry, but I dont know what to search for. Please enter your query in the search field, and Ill see what I can find.',
        'Ok'
      );
    } else {
      onSubmit(searchQuery);
    }
  };

  return (
    <Header>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="searchInput">
          <SearchBtn type="submit">
            <Span>Search</Span>
          </SearchBtn>
        </label>

        <Input
          id="searchInput"
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </Form>
    </Header>
  );
};
