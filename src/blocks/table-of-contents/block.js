import icon from './icon';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const { select, subscribe } = wp.data;

import './editor.scss';
import './style.scss';

import { Component } from 'react';

class TableOfContents extends Component{
    constructor(props){
        super(props);
        this.state = {
            headers: props.headers,
            unsubscribe: null
        }
    }
    componentDidMount(){
        const makeHeaderArray = origHeaders => {
            let arrays = [];
            origHeaders.forEach(header => {
                let last = arrays.length - 1;
                if (arrays.length === 0 || arrays[last][0].level < header.level){
                    arrays.push([header]);
                }
                else if(arrays[last][0].level === header.level){
                    arrays[last].push(header);
                }
                else{
                    while(arrays[last][0].level > header.level){
                        arrays[arrays.length-2].push(arrays.pop());
                        last = arrays.length - 1;
                    }
                    if(arrays[last][0].level === header.level){
                        arrays[last].push(header);
                    }
                }
            })
            while(arrays.length > 1 && arrays[arrays.length-1][0].level > arrays[arrays.length-2][0].level){
                arrays[arrays.length-2].push(arrays.pop());
            }
            return(arrays[0])
        }
        
        const headerBlocks = select('core/editor').getBlocks().filter(block => block.name === 'core/heading')
        const unsubscribe = subscribe(() =>{
            headerBlocks.forEach((heading, key) => {
                let {anchor, content} = heading.attributes;
                const headingAnchorEmpty = (typeof anchor === 'undefined' || anchor === '');
                const headingContentEmpty = (typeof content === 'undefined' || content === '');
                const headingDefaultAnchor = (!headingAnchorEmpty && anchor.indexOf( key + '-') === 0);
        
                if (!headingContentEmpty && (headingAnchorEmpty || headingDefaultAnchor)) {
                    anchor = key + '-' + content.toString().toLowerCase().replace(' ', '-');
                }
            })
            const headers = makeHeaderArray(headerBlocks.map(header => header.attributes));
            this.setState({headers});
        })
        this.setState({unsubscribe})
    }
    componentWillUnmount(){
        this.state.unsubscribe();
    }
    componentDidUpdate(prevProps, prevState){
        if(JSON.stringify(prevProps.headers) !== JSON.stringify(prevState.headers)){
            this.props.blockProp.setAttributes({links: JSON.stringify(this.state.headers)})
        }
    }
    render(){
        const parseList = list => {
            let items = []
            list.forEach(item => {
                items.push(Array.isArray(item) ?
                    parseList(item) :
                    <li><a href={`#${item.anchor}`}>{item.content}</a></li>
                );
            })
            return(<ul>{items}</ul>);
        }
        if(this.props.headers){
            return(<div className = "ub_table-of-contents">
                {parseList(this.props.headers)}
            </div>)
        }
        else{
            return (<p className = "ub_table-of-contents">Add a header to begin generating the table of contents</p>)
        }
    }
}

registerBlockType('ub/table-of-contents',{
    title: __('Table of Contents'),
    icon: icon,
    category: 'ultimateblocks',
    keywords: [
        __('Table of Contents'),
        __('Ultimate Blocks')
    ],
    attributes: {
        links:{
            type: 'string',
            default: ''
        }
    },
    supports:{
        multiple: false
    },
    edit(props) {
        return(<TableOfContents headers = {props.attributes.links ? JSON.parse(props.attributes.links) : props.attributes.links} blockProp = {props}/>);
    },
    save(props){
        return(<TableOfContents headers = {props.attributes.links ? JSON.parse(props.attributes.links) : props.attributes.links}/>);
    }
})