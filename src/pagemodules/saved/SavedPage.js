import * as React from 'react'
import { AppLoading } from 'expo'
import { Body, ListItem, List, Text, Right, Button, Icon } from 'native-base'
import { formatDistanceToNow } from 'date-fns'
import * as FileSystem from 'expo-file-system'
import * as configs from '../../configs'
import DialogPrompt from '../../components/DialogPrompt'
import { useNavigation } from '@react-navigation/native'

const stepMap = {
  preliminary: 'Preliminary Analysis',
  rating: 'Rating Analysis',
  sizing: 'Sizing Analysis',
}

const dirPath = FileSystem.documentDirectory + configs.saveDir + '/'

export const SavedItem = ({ fileName, onDelete }) => {
  const match = fileName.match('^([^_]+)_(.+).json$')
  const [, step, name] = match

  const navigation = useNavigation()
  const [fileInfo, setFileInfo] = React.useState()
  React.useEffect(() => {
    let isCurrent = true

    ;(async () => {
      const filePath = dirPath + fileName
      const fileInfo = await FileSystem.getInfoAsync(filePath)
      console.log(fileInfo)
      setFileInfo(fileInfo)
    })()
    return () => {
      isCurrent = false
    }
  }, [fileName])
  if (!match) return null

  const handlePress = async () => {
    console.log(fileName)
    const filePath = dirPath + fileName
    const json = await FileSystem.readAsStringAsync(filePath)
    const data = JSON.parse(json)

    navigation.navigate(stepMap[step], { loadedData: data, savedName: name })
  }

  const handleDelete = async () => {
    const confirm = await DialogPrompt.openDialog({
      title: 'Confirm delete',
      description: 'Are you sure you want to delete ' + name + '?',
      confirmLabel: 'Delete',
    })
    if (confirm) {
      const filePath = dirPath + fileName
      await FileSystem.deleteAsync(filePath, { idempotent: true })
      onDelete()
    }
  }

  return (
    <ListItem button onPress={handlePress}>
      <Body>
        <Text>{name}</Text>
        <Text note>{stepMap[step] || step}</Text>
      </Body>
      <Right>
        {fileInfo && fileInfo.modificationTime && (
          <Text note>
            {formatDistanceToNow(fileInfo.modificationTime * 1000, {
              addSuffix: true,
            })}
          </Text>
        )}
      </Right>
      <Right>
        <Button transparent onPress={handleDelete}>
          <Icon name="trash" />
        </Button>
      </Right>
    </ListItem>
  )
}

const refreshFileList = async () => {
  const dirData = await FileSystem.getInfoAsync(dirPath)

  if (!dirData.exists) {
    callback([])
    return
  }

  const fileList = await FileSystem.readDirectoryAsync(dirPath)

  return fileList
}

export const SavedPage = () => {
  const [savedList, setSavedList] = React.useState(null)
  const [r, refresh] = React.useReducer(s => !s)

  React.useEffect(() => {
    let isCurrent = true

    refreshFileList().then(setSavedList)
    return () => {
      isCurrent = false
    }
  }, [r])

  return savedList ? (
    savedList.length > 0 ? (
      <List
        dataArray={savedList}
        keyExtractor={s => s}
        renderRow={fileName => {
          return (
            <SavedItem key={fileName} fileName={fileName} onDelete={refresh} />
          )
        }}
      />
    ) : (
      <Text>No saved</Text>
    )
  ) : (
    <AppLoading />
  )
}

export default SavedPage
