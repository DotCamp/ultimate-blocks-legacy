/**
 * Post grid featured image.
 */

import get from 'lodash/get';
const { addQueryArgs } = wp.url;
const { apiFetch } = wp;

const { __ } = wp.i18n;
const { Component } = wp.element;

export default class FeaturedImage extends Component {

    constructor ( props ) {
        super();
        this.state = {
            imageUrl: '',
            image_data: [],
            loaded: false,
        }
    }

    componentDidMount () {
        this.stillMounted = true;
        this.fetchRequest = apiFetch({
            path: addQueryArgs( '/wp/v2/media/'+this.props.imgID),
        }).then(
            ( image_data ) => {
                if ( this.stillMounted ) {
                    this.setState({ image_data });
                    this.setImageUrl();
                }
            }
        ).catch(
            () => {
                if ( this.stillMounted ) {
                    this.setState({ image_data: [] });
                }
            }
        );
    }

    componentWillUnmount() {
        this.stillMounted = false;
    }

    setImageUrl = () => {
        let imageUrl = this.getImageUrl();

        if ( ! imageUrl ) {
            this.setState({
                loaded: true,
            })
        }

        if ( imageUrl ) {
            this.setState({
                imageUrl,
            });
        }
    };

    getImageUrl = () => {
        return (
            get(
                /* getMedia accepts an image id and returns an object with all the image data. */
                this.state.image_data,
                [
                    'media_details',
                    'sizes',
                    'ub-block-post-grid-landscape',
                    'source_url',
                ],
            )
        );
    };

    render(){
        return(
            <img src={this.state.imageUrl ? this.state.imageUrl : this.props.imgSizeLandscape} alt='img'/>
        );
    }
}
