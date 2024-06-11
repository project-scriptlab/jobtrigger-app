import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { TextStyles } from '../Constants/Styles'
import { Images } from '../Constants/Images'
import { Colors } from '../Constants/Colors'
import NavigationService from '../Services/Navigation'
import { screenHeight, textSize } from '../Constants/PixelRatio'
import { useTheme } from '@react-navigation/native'
import { FONTS } from '../Constants/Fonts'


const JobList = ({ title, backPage, jobList, loading, viewMore, count, paddingbottom, deleteJob }) => {
  const { colors } = useTheme();

  // useEffect();

  return (
    <View style={{ paddingBottom: paddingbottom ? paddingbottom : 60 }}>
      {title && <Text style={{ ...TextStyles.title2, color: colors.text }}>{title}</Text>}
      <View style={{ marginTop: 10 }}>
        {/* (!loading || count > 0) &&  */}
        {<FlatList
          data={jobList}
          onEndReached={viewMore ? viewMore : () => console.log('onEndReached2...')}
          // onEndReached={()=>console.log('cjount...',count)}
          onEndReachedThreshold={0.1}
          // style={{marginBottom:100}}
          // scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          // onMomentumScrollEnd={()=>console.log('onMomentumScrollEnd...')}
          renderItem={(!loading || count > 0) ? ({ item, index }) => {
            return (
              <>
                <Pressable style={{ flexDirection: 'row', gap: 10, flex: 6, marginBottom: 10, borderBottomWidth: 0.2, paddingBottom: 10, borderBottomColor: colors.lightBlck }}
                  onPress={() => NavigationService.navigate('JobDetails', { backPage: backPage ? backPage : 'Home', ...item, id: item.id, jobList: jobList })}
                >
                  <View style={{ flex: 4.2 }}>
                    <Text style={{ ...TextStyles.title3, marginBottom: 2, color: colors.textBase }}>{item.job_title}</Text>
                    {/* <Text style={{ color: Colors.black }}>{item.location}</Text> */}
                    {/* <Text style={{ marginTop: 5 }}>{item.date}</Text> */}
                    <View style={{ marginTop: 5 }}>
                      {item?.date && <View style={{ flexDirection: 'row', gap: 10, marginTop: 5, marginLeft: 2 }}>
                        <Image source={Images.clockLight} style={{ height: 14, width: 14, marginTop: 2, tintColor: colors.greyText }} />
                        <Text style={{ fontSize: textSize(10), color: colors.greyText }}>{item?.date}</Text>
                      </View>}
                      {/* <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                      <Image source={Images.deploma} style={{ height: 22, width: 20, marginTop: 2, tintColor: Colors.darkGrey, opacity: 0.9 }} />
                      <View style={{ flexDirection: 'row' }}>
                        {item?.qualification?.map((item, index) => { return (<Text style={{ fontSize: textSize(10) }}>{item?.name + (details1?.qualification?.length != index + 1 ? ', ' : '')}</Text>) })}
                      </View>
                    </View> */}
                      {/* {item.departments?.length > 0 && <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                      <Image source={Images.otherJobsLight} style={{ height: 14, width: 14, marginTop: 2, tintColor: Colors.black, marginLeft: 2, }} />
                      <View style={{ flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
                        {item?.departments?.map((item, index) => { return (<Text style={{ fontSize: textSize(10) }}>{item?.name + (index <  (item?.departments?.length-1)? ',' : '')}</Text>) })}
                      </View>
                    </View>} */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {(item.locations?.length > 0 || item.states?.length > 0) && <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                          <Image source={Images.locationDrawer} style={{ height: 15, width: 15, marginTop: 2, tintColor: colors.greyText, marginLeft: 2 }} />
                          <View style={{ flexDirection: 'row', gap: 2 }}>
                            {item?.locations?.map((itm, ind) => {
                              return (
                                <>
                                  {ind < 2 && <Text style={{ fontSize: textSize(10), color: colors.greyText, fontFamily: FONTS.medium }}>{itm.name + ','}</Text>}
                                </>
                              )
                            })}
                            {/* <Text>husdjlknl</Text> */}
                            {item?.states?.map((itm, ind) => {
                              return (
                                <>
                                  {ind < 1 && <Text style={{ fontSize: textSize(10), color: colors.greyText }}>{itm.name}</Text>}
                                </>
                              )
                            })}
                          </View>
                        </View>}
                        <View>
                          {deleteJob && <TouchableOpacity
                            // style={{ marginTop: 10, alignSelf: 'flex-end' }}
                            onPress={() => deleteJob(item.id)}
                          >
                            <Image source={Images.delete} style={{ width: 18, height: 18, resizeMode: 'contain', tintColor: colors.text }} />
                          </TouchableOpacity>}
                        </View>
                      </View>

                    </View>
                  </View>
                  <View style={{ flex: 1.5 }}>
                    <Image
                      // source={Images.jobImageSample}
                      source={{ uri: item.job_list_image }}
                      style={{
                        width: '100%',
                        height: 70,
                        resizeMode: 'stretch',
                        marginTop: 7
                      }}
                    />
                  </View>
                </Pressable>
              </>
            )
          } : null}
          keyExtractor={(itm, index) => index.toString()}
          ListFooterComponent={() => {
            return (
              <>
                {loading && count > 0 && <ActivityIndicator size={28} style={{ marginTop: count > 0 ? 10 : 150, marginBottom: count > 0 ? 20 : 0 }} />}
              </>
            )
          }}
        />}
      </View>
      {loading && (count == 0 || !count) && <ActivityIndicator size={28} style={{ marginTop: 150 }} />}
      {jobList.length == 0 && !loading && <Text style={{ textAlign: 'center', marginTop: screenHeight / 3, color: colors.greyText }}>No Records Found !</Text>}
    </View>
  )
}

export default JobList

const styles = StyleSheet.create({})