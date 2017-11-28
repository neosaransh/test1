import Drawer from 'react-motion-drawer';
import React, {Component} from 'react';
import SinglePatientQueryBuilder from './SinglePatientQueryBuilder.js';
import './Drawer.css';

export default class TestDrawer extends Component {
    lastAcceptClose = null;

    state = {
        open: false,
        relativeWidth: true,
        width: 300
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.acceptClose && nextProps.acceptClose != this.lastAcceptClose) {
            this.lastAcceptClose = nextProps.acceptClose;
            setImmediate(() => nextProps.acceptClose(() => this.setState({open: false})));
        }
    }

    render() {
        const style = {
            background: "rgba(52, 152, 219,1.0)",
            color: "white",
            overflow: "scroll"
        };
        var {open} = this.state;

        return (
            <div className='scrollable' style={{display: 'inline-block', ...(this.props.style || {})}}>
                <button className={this.props.buttonClass} onClick={() => this.setState({open: true})}>{this.props.buttonText || 'Open Drawer'}</button>
                <Drawer className='drawer' noTouchOpen={true} noTouchClose={true} drawerStyle={style} width={800} panTolerance={10000} open={open} onChange={open => this.setState({open})}>
                    <button className='closebtn' style={{fontSize:"30px", float:"right"}} onClick={() => this.setState({open: false})}>&#xd7;</button>
                    {this.props.children || null}
                </Drawer>
            </div>
        );
    }
}
