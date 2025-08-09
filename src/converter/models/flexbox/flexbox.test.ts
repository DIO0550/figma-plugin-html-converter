import { describe, it, expect } from 'vitest';
import { Flexbox } from './flexbox';
import { Styles } from '../styles';

describe('Flexbox', () => {
  describe('Flexbox.isFlexContainer', () => {
    it('should return true for display: flex', () => {
      const styles = Styles.from({ display: 'flex' });
      expect(Flexbox.isFlexContainer(styles)).toBe(true);
    });

    it('should return true for display: inline-flex', () => {
      const styles = Styles.from({ display: 'inline-flex' });
      expect(Flexbox.isFlexContainer(styles)).toBe(true);
    });

    it('should return false for display: block', () => {
      const styles = Styles.from({ display: 'block' });
      expect(Flexbox.isFlexContainer(styles)).toBe(false);
    });

    it('should return false when display is not set', () => {
      const styles = Styles.from({});
      expect(Flexbox.isFlexContainer(styles)).toBe(false);
    });
  });

  describe('Flexbox.getFlexDirection', () => {
    it('should return HORIZONTAL for row (default)', () => {
      const styles = Styles.from({ display: 'flex' });
      expect(Flexbox.getFlexDirection(styles)).toBe('HORIZONTAL');
    });

    it('should return HORIZONTAL for flex-direction: row', () => {
      const styles = Styles.from({ display: 'flex', 'flex-direction': 'row' });
      expect(Flexbox.getFlexDirection(styles)).toBe('HORIZONTAL');
    });

    it('should return HORIZONTAL for flex-direction: row-reverse', () => {
      const styles = Styles.from({ display: 'flex', 'flex-direction': 'row-reverse' });
      expect(Flexbox.getFlexDirection(styles)).toBe('HORIZONTAL');
    });

    it('should return VERTICAL for flex-direction: column', () => {
      const styles = Styles.from({ display: 'flex', 'flex-direction': 'column' });
      expect(Flexbox.getFlexDirection(styles)).toBe('VERTICAL');
    });

    it('should return VERTICAL for flex-direction: column-reverse', () => {
      const styles = Styles.from({ display: 'flex', 'flex-direction': 'column-reverse' });
      expect(Flexbox.getFlexDirection(styles)).toBe('VERTICAL');
    });
  });

  describe('Flexbox.getJustifyContent', () => {
    it('should return MIN for flex-start (default)', () => {
      const styles = Styles.from({ display: 'flex' });
      expect(Flexbox.getJustifyContent(styles)).toBe('MIN');
    });

    it('should return MIN for justify-content: flex-start', () => {
      const styles = Styles.from({ display: 'flex', 'justify-content': 'flex-start' });
      expect(Flexbox.getJustifyContent(styles)).toBe('MIN');
    });

    it('should return MAX for justify-content: flex-end', () => {
      const styles = Styles.from({ display: 'flex', 'justify-content': 'flex-end' });
      expect(Flexbox.getJustifyContent(styles)).toBe('MAX');
    });

    it('should return CENTER for justify-content: center', () => {
      const styles = Styles.from({ display: 'flex', 'justify-content': 'center' });
      expect(Flexbox.getJustifyContent(styles)).toBe('CENTER');
    });

    it('should return SPACE_BETWEEN for justify-content: space-between', () => {
      const styles = Styles.from({ display: 'flex', 'justify-content': 'space-between' });
      expect(Flexbox.getJustifyContent(styles)).toBe('SPACE_BETWEEN');
    });

    it('should return SPACE_BETWEEN for justify-content: space-around', () => {
      const styles = Styles.from({ display: 'flex', 'justify-content': 'space-around' });
      expect(Flexbox.getJustifyContent(styles)).toBe('SPACE_BETWEEN');
    });

    it('should return SPACE_BETWEEN for justify-content: space-evenly', () => {
      const styles = Styles.from({ display: 'flex', 'justify-content': 'space-evenly' });
      expect(Flexbox.getJustifyContent(styles)).toBe('SPACE_BETWEEN');
    });
  });

  describe('Flexbox.getAlignItems', () => {
    it('should return MIN for align-items: flex-start', () => {
      const styles = Styles.from({ display: 'flex', 'align-items': 'flex-start' });
      expect(Flexbox.getAlignItems(styles)).toBe('MIN');
    });

    it('should return MAX for align-items: flex-end', () => {
      const styles = Styles.from({ display: 'flex', 'align-items': 'flex-end' });
      expect(Flexbox.getAlignItems(styles)).toBe('MAX');
    });

    it('should return CENTER for align-items: center', () => {
      const styles = Styles.from({ display: 'flex', 'align-items': 'center' });
      expect(Flexbox.getAlignItems(styles)).toBe('CENTER');
    });

    it('should return MIN for align-items: stretch (default)', () => {
      const styles = Styles.from({ display: 'flex' });
      expect(Flexbox.getAlignItems(styles)).toBe('MIN');
    });

    it('should return MIN for align-items: stretch', () => {
      const styles = Styles.from({ display: 'flex', 'align-items': 'stretch' });
      expect(Flexbox.getAlignItems(styles)).toBe('MIN');
    });

    it('should return CENTER for align-items: baseline', () => {
      const styles = Styles.from({ display: 'flex', 'align-items': 'baseline' });
      expect(Flexbox.getAlignItems(styles)).toBe('CENTER');
    });
  });

  describe('Flexbox.parseSpacing', () => {
    it('should parse pixel values', () => {
      expect(Flexbox.parseSpacing('10px')).toBe(10);
      expect(Flexbox.parseSpacing('20.5px')).toBe(20.5);
    });

    it('should parse unitless values', () => {
      expect(Flexbox.parseSpacing('15')).toBe(15);
    });

    it('should return 0 for invalid values', () => {
      expect(Flexbox.parseSpacing(undefined)).toBe(0);
      expect(Flexbox.parseSpacing('')).toBe(0);
      expect(Flexbox.parseSpacing('auto')).toBe(0);
    });
  });

  describe('Flexbox.parsePadding', () => {
    it('should parse individual padding values', () => {
      const styles = Styles.from({
        'padding-top': '10px',
        'padding-right': '20px',
        'padding-bottom': '30px',
        'padding-left': '40px'
      });
      
      const padding = Flexbox.parsePadding(styles);
      expect(padding).toEqual({
        paddingTop: 10,
        paddingRight: 20,
        paddingBottom: 30,
        paddingLeft: 40
      });
    });

    it('should parse shorthand padding', () => {
      const styles = Styles.from({
        padding: '10px 20px 30px 40px'
      });
      
      const padding = Flexbox.parsePadding(styles);
      expect(padding).toEqual({
        paddingTop: 10,
        paddingRight: 20,
        paddingBottom: 30,
        paddingLeft: 40
      });
    });

    it('should handle two-value shorthand', () => {
      const styles = Styles.from({
        padding: '10px 20px'
      });
      
      const padding = Flexbox.parsePadding(styles);
      expect(padding).toEqual({
        paddingTop: 10,
        paddingRight: 20,
        paddingBottom: 10,
        paddingLeft: 20
      });
    });

    it('should handle single-value shorthand', () => {
      const styles = Styles.from({
        padding: '15px'
      });
      
      const padding = Flexbox.parsePadding(styles);
      expect(padding).toEqual({
        paddingTop: 15,
        paddingRight: 15,
        paddingBottom: 15,
        paddingLeft: 15
      });
    });
  });
});