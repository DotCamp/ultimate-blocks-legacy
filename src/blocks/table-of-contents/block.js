import icon from './icon';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const { select } = wp.data;

import './editor.scss';
import './style.scss';

const parseList = list => {
    let items = []
    list.forEach(item => {
        items.push(Array.isArray(item) ?
            parseList(item) :
            <li><a href={`#${item.anchor}`}>{item.content}</a></li>
        )
    })
    return(<ul>{items}</ul>)
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
    edit(props){
        const editor = select( 'core/editor' );
        const headers = editor.getBlocks()
            .filter( block => block.name === 'core/heading' )
            .map(header => header.attributes)

        const headerArray = origHeaders =>{
            let arrays = [];
            origHeaders.forEach(header =>{
                let last = arrays.length - 1
                if (arrays.length === 0 || arrays[last][0].level < header.level){
                    arrays.push([header])
                }
                else if(arrays[last][0].level === header.level){
                    arrays[last].push(header)
                }
                else{
                    while(arrays[last][0].level > header.level){
                        arrays[arrays.length-2].push(arrays.pop())
                        last = arrays.length - 1;
                    }
                    if(arrays[last][0].level === header.level){
                        arrays[last].push(header)
                    }
                }
            })
            
            while(arrays.length > 1 && arrays[arrays.length-1][0].level > arrays[arrays.length-2][0].level){
                arrays[arrays.length-2].push(arrays.pop())
            }
            return(arrays[0])
        }

        const linkList = headerArray(headers)
        props.setAttributes({links: JSON.stringify(linkList)})
        
        return(<div className = "ub_table-of-contents">{parseList(linkList)}</div>);
    },
    save(props){
        return(<div className = "ub_table-of-contents">
            {parseList(JSON.parse(props.attributes.links))}
        </div>);
    }
})