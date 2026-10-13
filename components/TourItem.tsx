import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Tour, formatDate, getSeatLabel } from '../utils/tour';

export interface TourItemProps {
  tour: Tour;
  compact?: boolean;
  onPress: (tour: Tour) => void;
  onToggleFavorite: (id: string, next: boolean) => void;
}

const TourItem: React.FC<TourItemProps> = ({
  tour,
  compact = false,
  onPress,
  onToggleFavorite,
}) => {
  const isRedSeat = tour.seats <= 3;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.card, compact ? styles.compactCard : styles.fullCard]}
      onPress={() => onPress(tour)}
    >
      <View style={compact ? styles.compactImageContainer : null}>
        <Image
          source={{ uri: tour.image }}
          style={compact ? styles.compactImage : styles.fullImage}
        />
        {compact && (
          <TouchableOpacity
            testID="fav-btn"
            style={styles.heartAbsolute}
            onPress={(e) => {
              e.stopPropagation?.();
              onToggleFavorite(tour.id, !tour.isFavorite);
            }}
          >
            <Text style={styles.heartText}>{tour.isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.info, compact && styles.compactInfo]}>
        <Text
          numberOfLines={compact ? 1 : 2}
          style={styles.tourName}
          onPress={() => onPress(tour)}
        >
          {tour.name}
        </Text>

        {!compact && (
          <>
            <Text style={styles.cityText}>{tour.city}</Text>
            <Text style={styles.metaText}>
              📅 {formatDate(tour.departure)} · {tour.days} ngày
            </Text>
            <Text style={[styles.seatText, isRedSeat && styles.redText]}>
              {getSeatLabel(tour.seats)}
            </Text>
          </>
        )}

        <Text style={styles.priceText}>
          {tour.price?.toLocaleString('vi-VN')} ₫
        </Text>
      </View>

      {!compact && (
        <TouchableOpacity
          testID="fav-btn"
          style={styles.favBtn}
          onPress={(e) => {
            e.stopPropagation?.();
            onToggleFavorite(tour.id, !tour.isFavorite);
          }}
        >
          <Text style={styles.heartText}>{tour.isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 6,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fullCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 12,
  },
  compactCard: {
    width: 160,
    marginRight: 10,
  },
  fullImage: {
    width: 90,
    height: 90,
    borderRadius: 6,
  },
  compactImageContainer: {
    position: 'relative',
    width: 160,
  },
  compactImage: {
    width: 160,
    aspectRatio: 4 / 3,
  },
  heartAbsolute: {
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  compactInfo: {
    padding: 8,
    marginLeft: 0,
  },
  tourName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  cityText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  seatText: {
    fontSize: 12,
    color: '#28a745',
    marginTop: 2,
  },
  redText: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e65100',
    marginTop: 4,
  },
  favBtn: {
    padding: 10,
  },
  heartText: {
    fontSize: 20,
  },
});

export default memo(TourItem);