// Gallery page (route /Gallery): a grid of pet photos, each with a caption.
import { useEffect } from "react";
import Navbar from "../layout/navbar.js";
import Footer from "../layout/footer.jsx"
import Reveal from "../layout/reveal.js"
import "./gallery.css";

import { PetGallery }  from "../../resources/art/pages/gallery/index.js";

// One entry per photo: id (also used as a CSS class for sizing), image, and caption
const PetsArray = [
    { id: "IMG_1213", image: PetGallery.IMG_1213, description: "off-guard flick" },
    { id: "IMG_0001", image: PetGallery.IMG_0001, description: "eepy ;3" },
    { id: "IMG_1222", image: PetGallery.IMG_1222, description: "You mirin' brah? 😺" },
    { id: "IMG_0002", image: PetGallery.IMG_0002, description: "Sqwishy" },
    { id: "IMG_1882", image: PetGallery.IMG_1882, description: "Maybe, fe-line relaxed." },
];

// Each photo will contain it's own data (picture and description).
const Gallery = () => {
      // Sets the browser tab title when the page loads
      useEffect(() => {
        document.title = "Marqed's Gallery";
      }, []);
    return (
        <>
            <Navbar />
            <div className="gallery-page">
                <h1 className="workspace-page-title gallery-page-title">
                    <span className="workspace-page-title-text">Gallery</span>
                </h1>
                <div className="gallery-grid">
                    {/* Reveal sits outside the card because .gallery-card has its own hover transform. */}
                    {PetsArray.map((media, index) => (
                        <Reveal key={media.id} index={index} className="gallery-reveal">
                        <div className="gallery-card">
                            <div className="gallery-image-wrapper">
                                <img
                                src={media.image}
                                alt={media.description.replace(/\s+/g, " ")}
                                className={`${media.id.toLowerCase()} gallery-image`}
                                />
                                <p className={`${media.id.toLowerCase()} gallery-description`}>
                                    {media.description}
                                </p>
                            </div>
                        </div>
                        </Reveal>
                    ))}
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default Gallery;
