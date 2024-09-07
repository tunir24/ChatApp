import React from 'react'
import {Avatar,HStack,Text} from "@chakra-ui/react";
function Message({text,uri,user="other"}) {
  return (
    <HStack alignSelf={user==="me"?'flex-end':'flex-start'} bg={"gray.300"} paddingY={1} paddingX={2} borderRadius={"6"}>
        {
          user==="other"&& <Avatar src={uri}/>
        }
        <Text>{text}</Text>
        {
          user==="me"&& <Avatar src={uri}/>
        }
    </HStack>
  )
}

export default Message;