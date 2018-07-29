import React from 'react';
import NiceButton from './NiceButton';

export default class BlueprintEditor extends React.Component {

    state = {
        viewType: 'structured', /* either structured or dump (dump == textfield) */
        version: 1,
        blueprint: {},
        fields: {},
    }

    globalIds = 0;

    addableObjects = [
        {
            name: '+ Light Switch',
            validator: () => {},
            thing: {
                category: 'light_switches',
                name: 'text',
                switch_port: 'text',
                on_state: 'number',
            }
        }, {
            name: '+ Dimmer',
            validator: () => {},
            thing: {
                category: 'dimmers',
                name: 'text',
                dimmer_port: 'text',
            }
        }, {
            name: '+ Curtain',
            validator: () => {},
            thing: {
                category: 'curtains',
                name: 'text',
                up_port: 'text',
                down_port: 'text',
                on_state: 'number'
            }
        }, {
            name: '+ Room',
            validator: () => {},
        }, {
            name: '+ Panel',
            validator: () => {}
        }
    ];

    componentWillReceiveProps(nextProps) {
        console.log('receiving blueprint');
        const { content } = this.props;
    }

    createArray(array, addables) {
        return {
            id: this.globalIds++,
            collapsed: false,
            array: object,
            addables: addables
        };
    }

    createObject(object) {
        return {
            id: this.globalIds++,
            collapsed: false,
            object: object
        };
    }

    createField(id, name, type, validator) {
        const { fields } = this.state;

        return {
            id: this.globalIds++,
            name: name,
            type: type,
            validator: validator,
        }

        /* add initial value in fields */
        fields[id] = '';

        this.setState({
            fields: fields
        });
    }

    v1ToEditorFormat(blueprint) {
        console.log('v1ToEditorFormat');

        /* deep copy blueprint */
        blueprint = JSON.parse(JSON.stringifgy(blueprint));
    }

    v2ToEditorFormat() {

    }

    editorFormatToV1() {

    }

    editorFormatToV2() {

    }

    renderViewTypeButtons() {
        const { viewType, version } = this.state;

        return <div style={styles.horizontal_flex}>
            <NiceButton onClick={() => this.setState({viewType: 'structured'})}
                extraStyle={{display: 'flex', flex: 1}}
                isHighlighted={viewType === 'structured'}>
                {'structured'}
                <form>
                    <input type={'radio'}
                        checked={version === 1}
                        onChange={() => this.setState({version: 1})} />v1
                    <input type={'radio'}
                        checked={version === 2}
                        onChange={() => this.setState({version: 2})} />v2
                </form>
            </NiceButton>
            <NiceButton onClick={() => this.setState({viewType: 'dump'})}
                extraStyle={{display: 'flex', flex: 1}}
                isHighlighted={viewType === 'dump'}>
                {'dump'}
            </NiceButton>
        </div>
    }

    renderAddableObjectButton(object, index) {
        return <NiceButton key={'addable-object-button-' + index}
            onClick={() => {}}>
            {object.name}
        </NiceButton>
    }

    parseJson(json_string) {
        var index = json_string.indexOf('{{');
        // FIXME: this will always be stuck at the first occurrence
        while (index !== -1 && json_string[index-1] !== '\"') {
            json_string = json_string.replace('{{', '\"{{');
            json_string = json_string.replace('}}', '}}\"');
            var index = json_string.indexOf('{{');
        }
        return JSON.parse(json_string);
    }

    renderStucturedNode(object) {
        const attributes = Object.keys(object).map((key) => {
            if (typeof object[key] == 'object') {
                if (object[key] instanceof Array) {
                    const array_objects = [];
                    for (var i = 0; i < object[key].length; i++) {
                        array_objects.push(this.renderStucturedNode(object[key][i]));
                    }
                    return <div key={'structured-node-key-' + key}
                        style={styles.node_attribute}>
                        {key}: {array_objects}
                    </div>;
                }
                else {
                    return this.renderStucturedNode(object[key]);
                }
            } else {
                return <div key={'structued-node-key-' + key}
                    style={styles.node_attribute}>
                    {key}: {object[key]}
                </div>;
            }
        });

        return <div style={styles.node}>
            {attributes}
        </div>;
    }

    renderStructuredV1Editor(object) {
      return this.renderStucturedNode(object);
    }

    render() {
        const { content, editable, onChange } = this.props;
        const { viewType, version } = this.state;

        /* render addable objects buttons */
        const addable_objects = [];
        for (var i = 0; i < this.addableObjects.length; i++) {
            addable_objects.push(
                this.renderAddableObjectButton(this.addableObjects[i], i));
        }

        var editor = null;
        if (viewType === 'structured') {
            if (version === 1) {
                editor = this.renderStructuredV1Editor(this.parseJson(content));
            }
        }

        else if (viewType === 'dump') {
            editor = <textarea style={{width: '100%'}}
                disabled={!editable}
                value={content}
                onChange={() => onChange({content: e.target.value})}
                rows={35} />;
        }

        else {
            throw 'مستحيل'
        }

        // <div style={styles.horizontal_flex}>
        //     {addable_objects}
        // </div>

        return (
            <React.Fragment>
                <h3>Blueprint Editor</h3>
                {this.renderViewTypeButtons()}
                <hr />
                {editor}
            </React.Fragment>
        );
    }
}

const styles = {
    horizontal_flex: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row'
    },
    node: {
        // width: '100%',
        border: '1px solid #BA3737',
        backgroundColor: 'rgba(186, 55, 55, 0.1)',
        padding: 20,
        paddingRight: 0,
        marginTop: 5,
        marginBottom: 5
    }
};
