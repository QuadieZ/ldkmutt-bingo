
import { useState, useRef } from 'react'
import { Camera } from "react-camera-pro"

import {
    Image,
    Stack,
    HStack,
    Button,
    Box
} from "@chakra-ui/react"
import axios from 'axios';
import Cookies from 'universal-cookie';

export const CameraComponent = ({ visible, setVisible, current, setCompleted, sent, setSent }) => {
    const camera = useRef(null);
    const cookies = new Cookies()
    const username = cookies.get("USERNAME")
    const token = cookies.get("TOKEN")
    const [taken, setTaken] = useState(null);

    const handleSend = () => {
        let updatedData
        const configuration = {
            method: "post",
            url: "https://ld-bingo-server.herokuapp.com/upload",
            data: {
                image: taken
            },
        };
        axios(configuration)
            .then((result) => {
                setCompleted(prev => {
                    const updated = prev
                    updated[current] = result.data.result.url
                    updatedData = updated
                    return updated
                })
                setSent(true)
                setTaken(null)

                axios.put('https://ld-bingo-server.herokuapp.com/data', {
                    username: username,
                    updated: updatedData
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                    .then((res) => console.log(res))
            })
            .catch((error) => {
                error = new Error();
                console.error(error)
            })
    }

    return (
        <Box display={visible && !sent ? 'box' : 'none'} zIndex={9999}>
            <Stack w="full" h="full" pos="fixed" top="0" right="0">
                <Camera ref={camera} facingMode="environment" />
            </Stack>

            <Stack w="full" h="full" pos="fixed" top="0" right="0" align="center" justify="flex-end" pb={4}>
                <HStack w="full" pos="fixed" top="0" r="0" justify="flex-end" pr={4} zIndex={1000}>
                    <Button bg="bg.light" onClick={() => { setVisible(false); setTaken(null) }} mt={4}>Close Camera</Button>
                </HStack>
                <Button bg="brand.primary" p={4} size="2xl" borderRadius="full" _hover={{ bg: 'brand.secondary' }} onClick={() => setTaken(camera.current.takePhoto())} display={!taken ? 'flex' : 'none'}><Image src="/camera.png" boxSize={6} /></Button>
                {taken && <Image src={taken} w="full" h="full" pos="fixed" top="0" right="0" zIndex={999} />}
                <HStack w="full" pos="fixed" b="0" r="0" display={taken ? 'flex' : 'none'} zIndex={1000} justify="flex-end" pr={4}>
                    <Button bg="bg.light" onClick={() => setTaken(null)}>Retake</Button>
                    <Button bg="brand.primary" color="content.contrast" _hover={{ bg: 'brand.secondary' }} onClick={() => handleSend(taken)}>Send</Button>
                </HStack>
            </Stack>
        </Box >)
}