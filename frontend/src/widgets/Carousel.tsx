import React from 'react';
import {
    Carousel as ShadCarousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/shared/ui/carousel';
import CustomCard from './CustomCard';
import './Carousel.css';

const cards = [
    {
        imageSrc: '../src/public/carousel-logo.png',
        caption: 'Logo',
        dimensions: '500 x 500 px',
        height: 500,
        width: 500,
    },
    // { imageSrc: '../src/public/carousel-whiteboard.png', caption: 'Whiteboard', dimensions: 'Unlimited' },
    // { imageSrc: '../src/public/carousel-doc.png', caption: 'Doc', dimensions: 'Autosize' },
    {
        imageSrc: '../src/public/carousel-bookmark.png',
        caption: 'Bookmark',
        dimensions: '2 x 6 in',
        height: 6 * 96,
        width: 2 * 96,
    },
    {
        imageSrc: '../src/public/carousel-business-card.png',
        caption: 'Business Card',
        dimensions: '3.5 x 2 in',
        height: 3.5 * 96,
        width: 2 * 96,
    },
    {
        imageSrc: '../src/public/carousel-post.png',
        caption: 'Instagram Post',
        dimensions: '1080 x 1080 px',
        height: 1080,
        width: 1080,
    },
    {
        imageSrc: '../src/public/carousel-flyer.png',
        caption: 'Flyer A4',
        dimensions: '21 x 29.7 cm',
        height: 29.7 * 37.795,
        width: 21 * 37.795,
    },
    {
        imageSrc: '../src/public/carousel-postcard.png',
        caption: 'Postcard',
        dimensions: '148 x 105 mm',
        height: 105 * 3.779527559,
        width: 148 * 3.779527559,
    },
    {
        imageSrc: '../src/public/carousel-poster.png',
        caption: 'Posters',
        dimensions: '42 x 59.4 cm',
        height: 59.4 * 37.795,
        width: 42 * 37.795,
    },
    {
        imageSrc: '../src/public/carousel-cover-image.jpg',
        caption: 'Cover Image',
        dimensions: '2000 x 600 px',
        height: 600,
        width: 2000,
    },
];

const Carousel: React.FC = () => {
    return (
        <div className="carousel-container">
            <ShadCarousel className="relative w-full">
                <CarouselContent className="flex">
                    {cards.map((card, index) => (
                        <CarouselItem key={index} className="carousel-item">
                            <CustomCard
                                imageSrc={card.imageSrc}
                                caption={card.caption}
                                dimensions={card.dimensions}
                                width={Math.round(card.width)}
                                height={Math.round(card.height)}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="carousel-arrow left-0" />
                <CarouselNext className="carousel-arrow right-0" />
            </ShadCarousel>
        </div>
    );
};

export default Carousel;
