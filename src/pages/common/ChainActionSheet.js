import * as React from 'react';
import {Actionsheet, Box, Text} from "native-base";
import ChainConfig from "../../ChainConfig";

export default class ChainActionSheet extends React.Component {
    state={
        isOpen:false
    }
    parentOnSelect
    constructor(props) {
        super(props);
        this.state.isOpen = props.isOpen;
        this.parentOnSelect = props.onSelect;
    }
    onItemPress(chainId){
        this.parentOnSelect(chainId);
        this.setState({
            isOpen:false
        })
    }
    render() {
        let chainItems = [];
        for (let id in ChainConfig) {
            chainItems.push(
                <Actionsheet.Item onPress={() => {
                    this.onItemPress(id)
                }} key={id}>{ChainConfig[id].name}
                </Actionsheet.Item>
            )
        }
        return (
            <Actionsheet isOpen={this.state.isOpen} onClose={()=>{this.onItemPress(null)}}>
                <Actionsheet.Content>
                    <Box w="100%" h={60} px={4} justifyContent="center">
                        <Text
                            fontSize="16"
                            color="gray.500"
                            _dark={{
                                color: "gray.300",
                            }}
                        >
                            请选择币种
                        </Text>
                    </Box>
                    {chainItems}
                </Actionsheet.Content>
            </Actionsheet>
        );
    }
    static getDerivedStateFromProps(props,state) {
        if (props.isOpen !== state.isOpen){
            return {
                isOpen:props.isOpen
            }
        }
        return null;
    }
}
