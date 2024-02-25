import { useState, useEffect } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getImages } from '../../services/api';

import { Container } from './App.styled';
import { LoadMoreButton } from '../Button/Button';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Loader } from '../Loader/Loader';
import { Modal } from '../Modal/Modal';
import { Searchbar } from '../Searchbar/Searchbar';

export const App = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const addImages = async () => {
      try {
        setLoading(true);

        const data = await getImages(query, page);

        const newImages = data.data.hits;

        if (newImages.length === 0) {
          return Notify.warning(
            'Sorry, but no images were found for your request. Please try modifying your query and try again.'
          );
        }

        const totalPages = Math.floor(data.data.total / 12);

        setImages(prevImages =>
          page === 1 ? newImages : [...prevImages, ...newImages]
        );
        setTotalPages(totalPages);

        if (page === 1) {
          return Notify.success(`${data.data.total} images found.`);
        }
      } catch (error) {
        setError('Sorry, an error occurred. Please try again.');
        Notify.error(`${error}`);
      } finally {
        setLoading(false);
      }
    };

    if (query !== '') {
      addImages();
    }
  }, [query, page]);

  const onSubmit = data => {
    setQuery(data);
    setImages([]);
    setPage(1);
    setTotalPages(0);
    setError(null);
  };

  const onLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const toggleModal = largeImageURL => {
    setShowModal(prevShowModal => !prevShowModal);
    setLargeImageURL(largeImageURL);
  };

  return (
    <Container>
      <Searchbar onSubmit={onSubmit} />

      {images.length > 0 && (
        <ImageGallery images={images} showModal={toggleModal} />
      )}

      {images.length > 0 && page <= totalPages && (
        <LoadMoreButton loadMore={onLoadMore}>Load More...</LoadMoreButton>
      )}

      {loading && <Loader />}

      {error && <Error>Oops.., error: {error}</Error>}

      {showModal && (
        <Modal largeImageURL={largeImageURL} onClose={toggleModal} />
      )}
    </Container>
  );
};
