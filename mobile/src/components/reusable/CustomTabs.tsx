import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

export type tabType = {
  title: string;
  totalCount?: number;
  tabContent?: React.ReactElement;
};

type Props = {
  tabs: tabType[];
  activeTab: number;
  setActiveTab: (index: number) => void;
};

const CustomTabs = ({ tabs, activeTab, setActiveTab }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScrollView}>
      <View style={styles.container}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab,
              activeTab === index && styles.activeTab, // Apply active style if the tab is active
            ]}
            onPress={() => setActiveTab(index)}>
            <Text style={activeTab === index ? styles.activeTabText : styles.tabText}>
              {tab?.title}{' '}
              {tab?.totalCount && (
                <Text style={{ color: activeTab === index ? theme.primary : theme.silver }}>
                  ({tab?.totalCount})
                </Text>
              )}
            </Text>
            {activeTab === index && <View style={styles.activeIndicator} />}
            {/* Indicator for active tab */}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default CustomTabs;

const getStyles = (theme: any) =>
  StyleSheet.create({
    tabScrollView: {
      backgroundColor: theme.white,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.white,
    },
    tab: {
      paddingVertical: 15,
      paddingHorizontal: 15,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: theme.primary, // Active color indicator
    },
    activeTabText: {
      fontSize: 16,
      fontFamily: 'InterBold',
      color: theme.textDark,
    },
    tabText: {
      fontSize: 16,
      fontFamily: 'InterBold',
      color: theme.silver,
    },
    activeIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: theme.primary, // Active color indicator
    },
  });
