import {Box,Container,VStack,Button, HStack,Input} from "@chakra-ui/react";
import Message from "./Message";
import {onAuthStateChanged,getAuth,GoogleAuthProvider,signInWithPopup,signOut} from "firebase/auth";
import { app } from "./firebase";
import { useEffect, useRef, useState } from "react";
import {getFirestore,addDoc, collection, serverTimestamp,onSnapshot,query,orderBy} from "firebase/firestore";

const auth = getAuth(app);
const db=getFirestore(app);
const loginHandler=()=>{
  const Provider = new GoogleAuthProvider();
  signInWithPopup(auth,Provider);
}

let logout=()=>{
  signOut(auth);
}


function App() {
  let divForScroll = useRef(null);
  const [msgs,setmsgs]=useState([]);
  let [msg,setmsg]=useState("");
  let submithandler=async(e)=>{
    e.preventDefault();
    try {
      setmsg("");

      await addDoc(collection(db,"Messages"),{
        text:msg,
        uid:user.uid,
        uri:user.photoURL,
        CreatedAt:serverTimestamp()
      })
      divForScroll.current.scrollIntoView({behavior : "smooth"})
    } catch (error) {
      alert(error);
    }
  }
  let[user,setuser]=useState(false);
  
  useEffect(()=>{
    const q=query(collection(db,"Messages"),orderBy("CreatedAt","asc"))
    let unsubscribe=onAuthStateChanged(auth,(data)=>{
      setuser(data);
    })
    const uns=onSnapshot(q,(snap)=>{
      setmsgs(snap.docs.map((i)=>{
        let id = i.id;
        return {id,...i.data()}
      }));
    })
    return()=>{
      unsubscribe();
      uns();
    };
  },[]);
  return (
<>
<Box bg={"red.50"}>
  {user?(
  <Container h={"100vh"}>
    <VStack className="hoi" h={"full"} bg={"white"} padding={4}  border={"2px solid black"} borderRadius={10}> 
      <Button colorScheme={"red"} w={"full"} onClick={logout}>LogOut</Button>
<VStack h="full" w="full" overflowY={"auto"} css={{scrollbarWidth: "thin"}}>
  {
    msgs.map((i)=>(
      <Message key={i.index} text={i.text} uri={i.uri} user={i.uid===user.uid?"me":"other"} />
    ))
  }
  <div ref={divForScroll}></div>

</VStack>

<Box w={"100%"} p={"2"} bg={"purple.200"}>
<form action="submit" style={{width:"100%" , bg:"red"}}  >
  <HStack>
  <Input value={msg} onChange={(e)=>setmsg(e.target.value)}  type="text" placeholder="Enter your chat " bg={"white"} />
  <Button colorScheme="blue" onClick={submithandler} >Send</Button>
  </HStack>
</form>
</Box>
    </VStack>
  </Container>
  ):(<VStack justifyContent={"center"} alignItems={"center"} h={"100vh"}>
    <Button colorScheme={"purple"} onClick={loginHandler}>Sign In</Button>
  </VStack>)}
</Box>
</>
  );
}

export default App;
