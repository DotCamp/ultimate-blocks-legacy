/**
 * Post grid featured image.
 */

import get from 'lodash/get';
const { addQueryArgs } = wp.url;
const { apiFetch } = wp;

const { __ } = wp.i18n;
const { Fragment, Component } = wp.element;
const { Placeholder, Dashicon } = wp.components;

export default class PostGridImage extends Component {

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
            <Fragment>
                 <img src={this.state.imageUrl ? this.state.imageUrl : this.props.imgSizeLandscape} alt='img'/>
                {
                    (this.state.loaded) &&
                    <Fragment>
                        <div className={'ub-post-grid-no-image-icon'}>
                            <Dashicon
                                icon={'warning'}
                            />
                        </div>

                        <Placeholder
                            className={'ub-post-grid-no-image-placeholder'}
                        >
                            <Dashicon icon={'info'}/>
                            <div className="components-placeholder__label">
                                {__('The correct size was not found for this image, so it may not display correctly. Recommended image height 400px.')}
                            </div>
                        </Placeholder>
                    </Fragment>
                }
            </Fragment>
        );
    }
}
