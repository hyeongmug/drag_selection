function DragSelection(zone, point, mode) {

    var self = this;

    var start_x, // number
        start_y, // number
        end_X, // number
        end_y, // number
        line_top, // number
        line_left, // number
        line_right, // number
        line_bottom, // number
        item_left, // number
        item_top, // number
        item_right, // number
        item_bottom, // number
        is_mouse_down, // boolean
        is_mouse_move, // boolean
        is_pass, // boolean
        $zone = $(zone), // jquery object
        $point = $(point), // jquery object
        $item; // jquery object

    this.select_list = new Array($point.length);

    // 리셋 메소드
    this.reset = function() {
        $point.each(function(i, v) {
            var $v = $(v);
            self.select_list[i] = false;
            $v.removeClass('active');
        })
    }

    $zone.on('mousedown', function(e) {
        e.preventDefault();
        is_mouse_down = true;
        $line = $('<div class="drag_selection_line"></div>').appendTo($zone);
        start_x = e.pageX;
        start_y = e.pageY;
    });

    $zone.on('mousemove', function(e) {
        e.preventDefault();
        is_mouse_move = true;
        if (is_mouse_down === true) {

            var $line = $zone.find('.drag_selection_line');

            $line.css({
                left: Math.min(e.pageX, start_x),
                top: Math.min(e.pageY, start_y),
                width: Math.abs(e.pageX - start_x),
                height: Math.abs(e.pageY - start_y)
            });

            line_top = $line.offset().top;
            line_left = $line.offset().left;
            line_right = line_left + $line.width();
            line_bottom = line_top + $line.height();

            $point.each(function(i, v) {

                $item = $(v);

                // 4면의 위치 값을 구함
                item_top = $item.offset().top;
                item_left = $item.offset().left;
                item_right = item_left + $item.width();
                item_bottom = item_top + $item.height();

                // 드래그 범위와 블록의 위치가 일치하는지 판단     
                is_pass = false;

                var a = item_left > line_left && item_left < line_right,
                    b = item_right > line_left && item_right < line_right,
                    c = item_top > line_top && item_top < line_bottom,
                    d = item_bottom > line_top && item_bottom < line_bottom,
                    e = item_top < line_top && item_bottom > line_bottom,
                    f = item_left < line_left && item_right > line_right;

                if (a) {
                    if (c || d || e) {
                        is_pass = true;
                    }
                } else if (b) {
                    if (c || d || e) {
                        is_pass = true;
                    }
                } else if (c) {
                    if (a || b || f) {
                        is_pass = true;
                    }
                } else if (d) {
                    if (a || b || f) {
                        is_pass = true;
                    }
                } else if (e && f) {
                    is_pass = true;
                }

                if (is_pass === true) {
                    self.select_list[i] ? $item.removeClass('active') : $item.addClass('active');
                } else {
                    self.select_list[i] ? $item.addClass('active') : $item.removeClass('active');
                }

            });

        }
    });

    $zone.on('mouseup', function(e) {
        e.preventDefault();
        if (is_mouse_move === true) {
            is_mouse_down = false;
            is_mouse_move = false;
            $zone.find('.drag_selection_line').remove();
            $point.each(function(i, v) {
                self.select_list[i] = $(v).hasClass('active') ? true : false;
            });

            if (mode == 'test') {
                console.log(self.select_list);
            }
        }
    });

    $point.each(function(i, v) {
        var $v = $(v);
        self.select_list[i] = false;
        $v.click(function() {
            if (!is_mouse_move) {
                if (self.select_list[i]) {
                    self.select_list[i] = false;
                    $v.removeClass('active');
                } else {
                    self.select_list[i] = true;
                    $v.addClass('active');
                }

                if (mode == 'test') {
                    console.log(self.select_list);
                }
            }
        })
    })
}
