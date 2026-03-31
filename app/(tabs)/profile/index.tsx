import { AuthService } from "@/api/Auth";
import useCloudinaryUpload from "@/hooks/upload";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Bookmark, Crown, Delete, Edit, HelpCircle, LogOut, PlusCircle, Settings, Shield, ShoppingBagIcon, Star, User, Zap } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";


export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [countData,setCountData] = useState();
  const [recentLikedPrompts, setRecentLikedPrompts] = useState([]);
  const [recentPurchasedPrompts, setRecentPurchasedPrompts] = useState([]);
  const user = useAppSelector((state: RootState) => state.user);
  const [profileImage , setProfileImage] = useState(user?.profilePicture);

  const fetchUserData = async () => {
  try {
    const response = await AuthService.getUserStatistics();
    console.log("user statics data", response);
    setCountData(response.data.counts);
    setRecentLikedPrompts(response.data.recentlyLiked || []);
    setRecentPurchasedPrompts(response.data.recentPurchases || []);
    
  } catch (error) {
    console.error("Error fetching user stats:", error);
  }
  };


  useEffect(()=>{
       fetchUserData();
  },[user])

  


  const handleSignOut = async () => {
    try {
      dispatch(logout());
      router.replace("/(auth)/login");
      Toast.show({
        type: "success",
        text1: "Logout SuccessFull",
        text2: "you are logout now",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: `${error.message}`,
      });
    }
  };

  const handleAction = (action: string) => {
    setActiveModal(action);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleDeleteChatHistory = () => {
    // Add your delete chat history logic here
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Chat history deleted successfully",
    });
    closeModal();
  };


  const { uploadToCloudinary, isUploading } = useCloudinaryUpload();

	const handleImageUpload = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: false, 
    allowsEditing: true,
    quality: 1,
  });


  if (!result.canceled && result.assets && result.assets.length > 0) {
    Toast.show({ type: "info", text1: "Uploading...", text2: "Updating your Profile" });
    try {
      const uploadResult = await uploadToCloudinary(result.assets[0].uri);
      if (uploadResult?.secure_url) {
        setProfileImage(uploadResult.secure_url);
        // Optionally update user profile on backend here
        Toast.show({ type: "success", text1: "Profile Updated", text2: "Profile image updated successfully." });
      } else {
        Toast.show({ type: "error", text1: "Upload Failed", text2: "No URL returned from Cloudinary." });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Upload Failed", text2: "Uploading Profile Failed" });
    }
  }
};
	

  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {profileImage ? (
                <View style={styles.avatar}>
                  <Image
                    source={{
                      uri: profileImage,
                    }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                    }}
                  />
                </View>
              ) : (
                <View style={styles.avatar}>
                  <User
                    size={32}
                    color='#6366F1'
                  />
                </View>
              )}
              <TouchableOpacity style={styles.editButton} onPress={handleImageUpload}>
                <Edit
                  size={14}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
            </View>

            <View style={styles.userInfoContainer}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>

              <View style={styles.planContainer}>
                <View style={styles.planBadge}>
                  <Crown
                    size={14}
                    color='#F59E0B'
                  />
                  <Text style={styles.planText}>Premium Plan</Text>
                </View>
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={fetchUserData}>
                  <Text style={styles.upgradeText}>Upgrade</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* My Prompts Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Prompts</Text>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAction("created-prompts")}>
              <PlusCircle
                size={20}
                color='#6366F1'
              />
              <Text style={styles.menuText}>Created Prompts</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{countData?.createdPrompts}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAction("Liked")}>
              <Star
                size={20}
                color='#6366F1'
              />
              <Text style={styles.menuText}>Liked Prompts</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{countData?.likedPrompts}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAction("purches")}>
              <ShoppingBagIcon
                size={20}
                color='#6366F1'
              />
              <Text style={styles.menuText}>Purchesed Prompts</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{countData?.purchasedPrompts}</Text>
              </View>
            </TouchableOpacity>

			<TouchableOpacity
  style={styles.menuItem}
  onPress={() => handleAction("recent-liked")}>
  <Bookmark
    size={20}
    color='#6366F1'
  />
  <Text style={styles.menuText}>Recent Liked</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.menuItem}
  onPress={() => handleAction("recent-purchased")}>
  <Bookmark
    size={20}
    color='#6366F1'
  />
  <Text style={styles.menuText}>Recent Purchased</Text>
</TouchableOpacity>
          </View>


          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chats</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAction("delete-chat")}>
              <Delete
                size={20}
                color='#6366F1'
              />
              <Text style={styles.menuText}>Delete Chat history</Text>
            </TouchableOpacity>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAction("settings")}>
              <Settings
                size={20}
                color='#6366F1'
              />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAction("privacy")}>
              <Shield
                size={20}
                color='#6366F1'
              />
              <Text style={styles.menuText}>Privacy & Security</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAction("subscription")}>
              <Zap
                size={20}
                color='#F59E0B'
              />
              <Text style={styles.menuText}>Subscription</Text>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PRO</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAction("help")}>
              <HelpCircle
                size={20}
                color='#6366F1'
              />
              <Text style={styles.menuText}>Help Center</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.logoutItem]}
              onPress={handleSignOut}>
              <LogOut
                size={20}
                color='#EF4444'
              />
              <Text style={[styles.menuText, styles.logoutText]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Settings Modal */}
      <Modal
        visible={activeModal === "settings"}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Settings</Text>
            
            <View style={styles.settingOption}>
              <Text style={styles.settingOptionText}>Notification Settings</Text>
              <View style={styles.switchPlaceholder} />
            </View>
            
            <View style={styles.settingOption}>
              <Text style={styles.settingOptionText}>Dark Mode</Text>
              <View style={styles.switchPlaceholder} />
            </View>
            
            <View style={styles.settingOption}>
              <Text style={styles.settingOptionText}>Language</Text>
              <Text style={styles.settingOptionValue}>English</Text>
            </View>
            
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Chat History Modal */}
      <Modal
        visible={activeModal === "delete-chat"}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Chat History</Text>
            <Text style={styles.modalText}>Are you sure you want to delete all your chat history? This action cannot be undone.</Text>
            
            <View style={styles.confirmationButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={handleDeleteChatHistory}
              >
                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={activeModal === "privacy"}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Privacy & Security</Text>
            
            <ScrollView style={styles.privacyScroll}>
              <Text style={styles.privacySectionTitle}>1. Information We Collect</Text>
              <Text style={styles.privacyText}>
                We collect information you provide directly to us, such as your name, email address, and any other information you choose to provide.
              </Text>
              
              <Text style={styles.privacySectionTitle}>2. How We Use Your Information</Text>
              <Text style={styles.privacyText}>
                We use the information we collect to provide, maintain, and improve our services, to develop new services, and to protect our users.
              </Text>
              
              <Text style={styles.privacySectionTitle}>3. Information Sharing</Text>
              <Text style={styles.privacyText}>
                We do not share your personal information with third parties except as described in this policy or with your consent.
              </Text>
              
              <Text style={styles.privacySectionTitle}>4. Security</Text>
              <Text style={styles.privacyText}>
                We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.
              </Text>
            </ScrollView>
            
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Help Center Modal */}
      <Modal
        visible={activeModal === "help"}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Help Center</Text>
            
            <View style={styles.helpItem}>
              <Text style={styles.helpLabel}>Support Email:</Text>
              <Text style={styles.helpValue}>aaryanmeena96@email.com</Text>
            </View>
            
            <View style={styles.helpItem}>
              <Text style={styles.helpLabel}>Phone Number:</Text>
              <Text style={styles.helpValue}>+91-9799819141</Text>
            </View>
            
            <View style={styles.helpItem}>
              <Text style={styles.helpLabel}>Business Hours:</Text>
              <Text style={styles.helpValue}>Mon-Fri, 9AM-5PM EST</Text>
            </View>
            
            <Text style={styles.helpNote}>
              Please contact us during business hours for the fastest response. We typically respond within 24 hours.
            </Text>
            
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
	  <Modal
  visible={activeModal === "recent-liked"}
  transparent={true}
  animationType="slide"
  onRequestClose={closeModal}
>
  <View style={styles.fullModalContainer}>
    <View style={styles.fullModalContent}>
      <Text style={styles.fullModalTitle}>Recently Liked Prompts</Text>
      
      {recentLikedPrompts.length > 0 ? (
        <ScrollView style={styles.promptsScrollView}>
          {recentLikedPrompts.map((prompt) => (
            <View key={prompt.id} style={styles.promptCard}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptTitle}>{prompt.title}</Text>
                <View style={styles.promptRating}>
                  <Star size={16} color="#F59E0B" />
                  <Text style={styles.promptRatingText}>{prompt.rating || 'New'}</Text>
                </View>
              </View>
              <Text style={styles.promptCategory}>{prompt.category}</Text>
              <Text style={styles.promptDescription} numberOfLines={2}>
                {prompt.description}
              </Text>
              <View style={styles.promptFooter}>
                <Text style={styles.promptPrice}>${prompt.price}</Text>
                <Text style={styles.promptLikes}>
                  <Star size={14} color="#6366F1" /> {prompt.likesCount}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Star size={48} color="#E2E8F0" />
          <Text style={styles.emptyStateText}>No liked prompts yet</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={[styles.modalButton, styles.fullModalButton]} 
        onPress={closeModal}
      >
        <Text style={styles.modalButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* Recently Purchased Prompts Modal */}
<Modal
  visible={activeModal === "recent-purchased"}
  transparent={true}
  animationType="slide"
  onRequestClose={closeModal}
>
  <View style={styles.fullModalContainer}>
    <View style={styles.fullModalContent}>
      <Text style={styles.fullModalTitle}>Recently Purchased Prompts</Text>
      
      {recentPurchasedPrompts.length && recentPurchasedPrompts.length > 0 ? (
        <ScrollView style={styles.promptsScrollView}>
          {recentPurchasedPrompts.map((prompt) => (
            <View key={prompt.id} style={styles.promptCard}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptTitle}>{prompt.title}</Text>
                <View style={styles.promptRating}>
                  <Star size={16} color="#F59E0B" />
                  <Text style={styles.promptRatingText}>{prompt.rating || 'New'}</Text>
                </View>
              </View>
              <Text style={styles.promptCategory}>{prompt.category}</Text>
              <Text style={styles.promptDescription} numberOfLines={2}>
                {prompt.description}
              </Text>
              <View style={styles.promptFooter}>
                <Text style={styles.promptPrice}>${prompt.price}</Text>
                <Text style={styles.promptDate}>
                  Purchased: {new Date(prompt.purchaseDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <ShoppingBagIcon size={48} color="#E2E8F0" />
          <Text style={styles.emptyStateText}>No purchases yet</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={[styles.modalButton, styles.fullModalButton]} 
        onPress={closeModal}
      >
        <Text style={styles.modalButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E7FF",
  },
  avatarText: {
    color: "#6366F1",
    fontSize: 32,
    fontFamily: "Inter-Bold",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6366F1",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  userInfoContainer: {
    flex: 1,
  },
  userInfo: {
    marginBottom: 12,
  },
  userName: {
    color: "#1E293B",
    fontSize: 22,
    fontFamily: "Inter-Bold",
    marginBottom: 2,
  },
  userEmail: {
    color: "#64748B",
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  planContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  planText: {
    color: "#B45309",
    fontSize: 13,
    fontFamily: "Inter-SemiBold",
    marginLeft: 4,
  },
  upgradeButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  upgradeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "Inter-SemiBold",
  },
  section: {
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    color: "#1E293B",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  menuText: {
    color: "#1E293B",
    fontSize: 15,
    fontFamily: "Inter-Medium",
    marginLeft: 12,
    flex: 1,
  },
  badge: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Inter-Bold",
  },
  premiumBadge: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  premiumBadgeText: {
    color: "#1E293B",
    fontSize: 10,
    fontFamily: "Inter-Bold",
  },
  logoutItem: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FECACA",
  },
  logoutText: {
    color: "#DC2626",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
	  borderTopLeftRadius:20,
	  borderTopRightRadius:20,
	  paddingHorizontal:3
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#6366F1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#E2E8F0',
    flex: 1,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#EF4444',
    flex: 1,
  },
  confirmButtonText: {
    color: '#FFFFFF',
  },
  settingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  settingOptionText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
  },
  settingOptionValue: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  switchPlaceholder: {
    width: 50,
    height: 30,
    backgroundColor: '#E2E8F0',
    borderRadius: 15,
  },
  privacyScroll: {
    maxHeight: 300,
    marginBottom: 20,
  },
  privacySectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 6,
  },
  privacyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 12,
  },
  helpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  helpLabel: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
  },
  helpValue: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#6366F1',
  },
  helpNote: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 16,
    fontStyle: 'italic',
  },
  fullModalContainer: {
  flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
fullModalContent: {
  backgroundColor: '#FFFFFF',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingHorizontal:20,

  maxHeight: '80%',
},
fullModalTitle: {
  fontSize: 20,
  fontFamily: 'Inter-Bold',
  color: '#1E293B',
  marginBottom: 16,
  textAlign: 'center',
},
fullModalButton: {
  marginTop: 20,
},
promptsScrollView: {
  marginBottom: 10,
},
promptCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: '#E2E8F0',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
},
promptHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
},
promptTitle: {
  fontSize: 16,
  fontFamily: 'Inter-SemiBold',
  color: '#1E293B',
  flex: 1,
},
promptRating: {
  flexDirection: 'row',
  alignItems: 'center',
},
promptRatingText: {
  fontSize: 14,
  fontFamily: 'Inter-Medium',
  color: '#B45309',
  marginLeft: 4,
},
promptCategory: {
  fontSize: 14,
  fontFamily: 'Inter-Medium',
  color: '#6366F1',
  marginBottom: 8,
},
promptDescription: {
  fontSize: 14,
  fontFamily: 'Inter-Regular',
  color: '#64748B',
  marginBottom: 12,
  lineHeight: 20,
},
promptFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
promptPrice: {
  fontSize: 16,
  fontFamily: 'Inter-Bold',
  color: '#10B981',
},
promptLikes: {
  fontSize: 14,
  fontFamily: 'Inter-Medium',
  color: '#64748B',
  flexDirection: 'row',
  alignItems: 'center',
},
promptDate: {
  fontSize: 12,
  fontFamily: 'Inter-Regular',
  color: '#64748B',
},
emptyState: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 40,
},
emptyStateText: {
  fontSize: 16,
  fontFamily: 'Inter-Medium',
  color: '#64748B',
  marginTop: 16,
},
});