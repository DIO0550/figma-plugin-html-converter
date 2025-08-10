import { describe, it, expect } from 'vitest';
import { AutoLayoutProperties } from './auto-layout';
import { Styles } from '../styles';

describe('AutoLayoutProperties', () => {
  describe('AutoLayoutProperties.empty', () => {
    it('should create empty auto layout properties', () => {
      const properties = AutoLayoutProperties.empty();
      
      expect(properties).toEqual({
        layoutMode: 'HORIZONTAL',
        primaryAxisAlignItems: 'MIN',
        counterAxisAlignItems: 'MIN',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        itemSpacing: 0
      });
    });
  });

  describe('AutoLayoutProperties.from', () => {
    it('should create properties from object', () => {
      const properties = AutoLayoutProperties.from({
        layoutMode: 'VERTICAL',
        primaryAxisAlignItems: 'CENTER',
        counterAxisAlignItems: 'MAX',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        paddingBottom: 20,
        itemSpacing: 15
      });
      
      expect(properties.layoutMode).toBe('VERTICAL');
      expect(properties.primaryAxisAlignItems).toBe('CENTER');
      expect(properties.counterAxisAlignItems).toBe('MAX');
      expect(properties.itemSpacing).toBe(15);
    });
  });

  describe('AutoLayoutProperties.fromStyles', () => {
    it('should return null for non-flex containers', () => {
      const styles = Styles.from({ display: 'block' });
      expect(AutoLayoutProperties.fromStyles(styles)).toBeNull();
    });

    it('should convert basic flex container', () => {
      const styles = Styles.from({ display: 'flex' });
      const autoLayout = AutoLayoutProperties.fromStyles(styles);
      
      expect(autoLayout).toEqual({
        layoutMode: 'HORIZONTAL',
        primaryAxisAlignItems: 'MIN',
        counterAxisAlignItems: 'MIN',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        itemSpacing: 0
      });
    });

    it('should convert flex column with center alignment', () => {
      const styles = Styles.from({
        display: 'flex',
        'flex-direction': 'column',
        'justify-content': 'center',
        'align-items': 'center'
      });
      const autoLayout = AutoLayoutProperties.fromStyles(styles);
      
      expect(autoLayout).toEqual({
        layoutMode: 'VERTICAL',
        primaryAxisAlignItems: 'CENTER',
        counterAxisAlignItems: 'CENTER',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        itemSpacing: 0
      });
    });

    it('should convert gap property to itemSpacing', () => {
      const styles = Styles.from({
        display: 'flex',
        gap: '16px'
      });
      const autoLayout = AutoLayoutProperties.fromStyles(styles);
      
      expect(autoLayout?.itemSpacing).toBe(16);
    });

    it('should use column-gap for horizontal layout', () => {
      const styles = Styles.from({
        display: 'flex',
        'flex-direction': 'row',
        'column-gap': '20px',
        'row-gap': '10px'
      });
      const autoLayout = AutoLayoutProperties.fromStyles(styles);
      
      expect(autoLayout?.itemSpacing).toBe(20);
    });

    it('should use row-gap for vertical layout', () => {
      const styles = Styles.from({
        display: 'flex',
        'flex-direction': 'column',
        'column-gap': '20px',
        'row-gap': '10px'
      });
      const autoLayout = AutoLayoutProperties.fromStyles(styles);
      
      expect(autoLayout?.itemSpacing).toBe(10);
    });

    it('should handle gap shorthand with two values correctly', () => {
      const stylesHorizontal = Styles.from({
        display: 'flex',
        'flex-direction': 'row',
        gap: '10px 20px'
      });
      const autoLayoutHorizontal = AutoLayoutProperties.fromStyles(stylesHorizontal);
      
      expect(autoLayoutHorizontal?.itemSpacing).toBe(20); // column-gap

      const stylesVertical = Styles.from({
        display: 'flex',
        'flex-direction': 'column',
        gap: '10px 20px'
      });
      const autoLayoutVertical = AutoLayoutProperties.fromStyles(stylesVertical);
      
      expect(autoLayoutVertical?.itemSpacing).toBe(10); // row-gap
    });

    it('should convert padding properties', () => {
      const styles = Styles.from({
        display: 'flex',
        padding: '10px 20px'
      });
      const autoLayout = AutoLayoutProperties.fromStyles(styles);
      
      expect(autoLayout).toMatchObject({
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10
      });
    });

    it('should handle complex padding values', () => {
      const styles = Styles.from({
        display: 'flex',
        'padding-left': '5px',
        'padding-right': '10px',
        'padding-top': '15px',
        'padding-bottom': '20px'
      });
      const autoLayout = AutoLayoutProperties.fromStyles(styles);
      
      expect(autoLayout).toMatchObject({
        paddingLeft: 5,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 20
      });
    });
  });

  describe('AutoLayoutProperties setters', () => {
    it('should set layout mode', () => {
      const initial = AutoLayoutProperties.empty();
      const updated = AutoLayoutProperties.setLayoutMode(initial, 'VERTICAL');
      
      expect(updated.layoutMode).toBe('VERTICAL');
    });

    it('should set primary axis alignment', () => {
      const initial = AutoLayoutProperties.empty();
      const updated = AutoLayoutProperties.setPrimaryAxisAlign(initial, 'SPACE_BETWEEN');
      
      expect(updated.primaryAxisAlignItems).toBe('SPACE_BETWEEN');
    });

    it('should set counter axis alignment', () => {
      const initial = AutoLayoutProperties.empty();
      const updated = AutoLayoutProperties.setCounterAxisAlign(initial, 'CENTER');
      
      expect(updated.counterAxisAlignItems).toBe('CENTER');
    });

    it('should set item spacing', () => {
      const initial = AutoLayoutProperties.empty();
      const updated = AutoLayoutProperties.setItemSpacing(initial, 24);
      
      expect(updated.itemSpacing).toBe(24);
    });

    it('should set padding', () => {
      const initial = AutoLayoutProperties.empty();
      const updated = AutoLayoutProperties.setPadding(initial, {
        top: 10,
        right: 20,
        bottom: 30,
        left: 40
      });
      
      expect(updated.paddingTop).toBe(10);
      expect(updated.paddingRight).toBe(20);
      expect(updated.paddingBottom).toBe(30);
      expect(updated.paddingLeft).toBe(40);
    });

    it('should set partial padding', () => {
      const initial = AutoLayoutProperties.from({
        layoutMode: 'HORIZONTAL',
        primaryAxisAlignItems: 'MIN',
        counterAxisAlignItems: 'MIN',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        itemSpacing: 0
      });
      
      const updated = AutoLayoutProperties.setPadding(initial, {
        top: 20,
        bottom: 20
      });
      
      expect(updated.paddingTop).toBe(20);
      expect(updated.paddingBottom).toBe(20);
      expect(updated.paddingLeft).toBe(10); // 変更されない
      expect(updated.paddingRight).toBe(10); // 変更されない
    });
  });
});