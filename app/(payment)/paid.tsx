import { WebView } from 'react-native-webview';

export default function Paid(){
    return (
        <WebView className='flex-1'
      source={{ uri: 'https://vi.wikipedia.org/wiki/Trang_Ch%C3%ADnh' }}/>
    );
}