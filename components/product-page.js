import Layout from './layout'
import Container from './container'
import Head from 'next/head'
import CoverImage from './cover-image'
import {RichText} from 'prismic-reactjs';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import LazyLoad from 'react-lazyload';

// import ReactGA from 'react-ga';
// const trackingId = "UA-171559296-1"; // Replace with your Google Analytics tracking ID


class ProductCard extends React.Component{

  render(){
    const { posts, ...props } = this.props;
    ReactGA.initialize(trackingId);
    ReactGA.pageview('/'+this.props.uidName);

    const allPostContent = posts.map(function(post, postIndex){

      if(post.node._meta.uid === props.uidName){

        const allPostContentItems = post.node.body.map(function(slice, index){
          // Product Card
          if (slice.__typename === props.apiName+'_pageBodyProduct_card') {
            const productCardItem = [slice].map(function(productRow, productRowIndex){
              return(

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:col-gap-4 lg:col-gap-4 xl:col-gap-8 row-gap-4 md:row-gap-4 lg:row-gap-4 xl:row-gap-8 xl:mb-8 lg:mb-4 md:mb-4 mb-4" key={productRowIndex}>
                  {productRow.fields.map(function(card, cardIndex){
                    return(
                        <a href={card.product_card_link.url} className="shadow-small product-card hover:shadow-medium transition-shadow duration-200 border-solid border-2 border-gray-100 " key={cardIndex} target="_blank">
                        <LazyLoad key={cardIndex} height={200} offset={100}>
                          <CSSTransition
                            key={cardIndex}
                            in={true}
                            appear={true}
                            timeout={1000}
                            classNames="transition"
                            >
                            <div>
                              <div className="product-card-image h-64 md:h-56 lg:h-40 xl:h-64 pb-6">
                                <CoverImage
                                  url={card.product_card_image.url}
                                />
                              </div>
                              <h3 className="product-name px-4 text-1xl py-2 font-poppins leading-relaxed">
                                {card.product_card_title[0].text.length > 100 ? card.product_card_title[0].text.substring(0, 100) + '...' : card.product_card_title[0].text }
                              </h3>
                              <div className="px-4 pb-2 font-poppins">
                                <div className="product-price text-2xl font-bold pt-3 border-t-2 border-gray-200">
                                  <RichText render={card.product_card_price}/>
                                </div>
                              </div>
                            </div>
                            </CSSTransition>
                          </LazyLoad>
                          <div className="buy-tag font-bold py-2 px-4 font-abel rounded-bl-lg items-center justify-end flex flex-row shadow-md">
                            <span>View Now on Amazon</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="arrow w-4 h-4" viewBox="0 0 24 24"><path d="M17.428 5h-17.428l6.616 7-6.616 7h17.428l6.572-7z"/></svg>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                )
              })
              return productCardItem;
            }
            // Product Specific
            else if(slice.__typename === props.apiName+'_pageBodyProduct_page_specific_link') {

              const productSpecificItem = slice.fields.map(function(pageSpecific, pageSpecificIndex){
                  return (
                    <LazyLoad key={pageSpecificIndex} height={200} offset={100}>
                      <CSSTransition
                        key={pageSpecificIndex}
                        in={true}
                        appear={true}
                        timeout={1000}
                        classNames={{
                          appear: "transition-appear",
                          appearActive: "transition-appear-active"
                        }}
                      >
                      <a href={`${RichText.asText(pageSpecific.product_page_link)}`} className="specific-product-item grid md:grid-cols-2 grid-cols-1 flex items-center shadow-small hover:shadow-medium transition-shadow duration-200 xl:mb-8 lg:mb-4 md:mb-4 mb-4" key={pageSpecificIndex}>
                        <div className="product-card-image lg:h-110 sm:h-64 h-64" style={{background: 'url('+pageSpecific.product_image.url +')'}}>
                        </div>
                        <div className="specific-item-content text-6xl leading-snug p-4 text-center flex grid grid-cols-8 items-center justify-end lg:h-110 sm:h-64 h-64">
                          <div className="md:col-span-6 col-span-8 font-poppins font-bold">
                            <RichText render={pageSpecific.product_page_title}/>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="arrow w-34 h-16 md:col-span-1 col-span-8 md:block hidden" viewBox="0 0 24 24"><path d="M17.428 5h-17.428l6.616 7-6.616 7h17.428l6.572-7z"/></svg>
                        </div>
                      </a>
                    </CSSTransition>
                  </LazyLoad>
                    );

                  });

                  return productSpecificItem;

                } else if(slice.__typename === props.apiName+'_pageBodyPage_online_advert') {
                  const onlineAdvert = slice.fields.map(function(advertElem, advertElemIndex){
                    return (
                      <LazyLoad key={advertElemIndex} height={200} offset={100, 0}>
                        <CSSTransition
                        key={advertElemIndex}
                        in={true}
                        appear={true}
                        timeout={1000}
                        classNames="transition"
                        >
                        <div className="flex justify-center xl:mb-8 lg:mb-4 md:mb-4 mb-4" key={advertElemIndex}>
                          <a href={advertElem.page_advert_link.url} className="online-advert shadow-small hidden md:block" key={advertElemIndex} target="_blank">
                            <CoverImage
                              url={advertElem.page_advert_image_desktop.url}
                            />
                          </a>
                          <a href={advertElem.page_advert_link.url} className="online-advert shadow-small block md:hidden" key={advertElemIndex} target="_blank">
                            <CoverImage
                              url={advertElem.page_advert_image_mobile.url}
                            />
                          </a>
                        </div>
                        </CSSTransition>
                      </LazyLoad>
                    );
                  });
                  return onlineAdvert;
                }else {
                // Return null by default
                  return null;
                }
              })
            // Return allPostContent data
            return allPostContentItems;
            }
          }
        )
        // Display everything
        return (
          <div className="blog-content">
            {allPostContent}
          </div>
        );
      }
    }

export default ProductCard;
